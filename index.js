const nodemailer = require("nodemailer");
const wellKnown = require("nodemailer/lib/well-known");

const fetch = require("node-fetch");
const yargs = require("yargs");

async function sendEmail(subject, body) {
  let sender = process.env.SENDER;
  let receiver = process.env.RECEIVER;
  let password = process.env.PASSWORD;

  var domain = sender.split("@")[1];

  var config = wellKnown(domain);
  if (!config) {
    console.log(
      "[ERROR] Sender is not a well-known service. check at https://nodemailer.com/smtp/well-known/"
    );
    return;
  }

  config["auth"] = {
    user: sender,
    pass: password,
  };

  let transporter = nodemailer.createTransport(config);

  let info = await transporter.sendMail({
    from: `[Foogie Notifier] <${sender}>]`,
    to: receiver,
    subject: subject,
    html: body,
  });

  console.log(
    `[OK] Email sent to ${receiver} successfully. Message ID: ${
      info.messageId
    }  @ ${new Date().toLocaleString("zh-CN", { hour12: false })}`
  );
}

async function check() {
  const response = await fetch("https://foggie.fogworks.io/api/pms/product");
  const json = await response.json();

  var hasStock = false;

  for (const product of json.data) {
    if (product.stock > 0 && !product.notified) {
      hasStock = true;

      var subject = `[Foggie Stock Notice] Product ${product.name} stock is ${product.stock}`;
      var body = ` ${product.name}, stock is ${
        product.stock
      } @ ${new Date().toLocaleString("zh-CN", {
        hour12: false,
      })}  https://foggie.fogworks.io/`;
      await sendEmail(subject, body);
      product.notified = true;
    }

    if (product.stock == 0 && product.notified) {
      product.notified = false;
    }
  }

  console.log(
    "[FOOGIE] " + (hasStock ? "Has Stock" : "No Stock") +
      " @" +
      new Date().toLocaleString("zh-CN", { hour12: false })
  );
}

let argv = yargs
  .option("sender", {
    alias: "s",
    describe: "Sender Email Address",
    demandOption: true,
    requiresArg: true,
  })
  .option("password", {
    alias: "p",
    describe: "Sender Email Password",
    demandOption: true,
    requiresArg: true,
  })
  .option("receiver", {
    alias: "r",
    describe: "Receiver Email Address",
    demandOption: true,
    requiresArg: true,
  })
  .option("debug", {
    alias: "d",
    describe: "Debug Mode",
  })
  .help().argv;

process.env.SENDER = argv.sender;
process.env.RECEIVER = argv.receiver;
process.env.PASSWORD = argv.password;

if (argv.debug) {
  var subject = `[Foggie Stock Notice] Test email from Foggie Notifier @ ${new Date().toLocaleString(
    "zh-CN",
    { hour12: false }
  )}`;
  var body = `Test email from Foggie Notifier @ ${new Date().toLocaleString(
    "zh-CN",
    { hour12: false }
  )}`;
  sendEmail(subject, body).then(() => {
    console.log("[OK] Test email sent successfully.");
  });
} else {
  setInterval(async () => {
    try {
      await check();
    } catch (e) {
      console.log(e);
    }
  }, 5000);
  check();
}
