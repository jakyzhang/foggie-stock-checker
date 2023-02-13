## Foggie NFT Stock Checker

This is a simple application to check the current stock of the Foggie NFTs on foggie.io.

It will check the stock Every 5 seconds  and send a email notification if the stock is available.

## Used API of Foggie
https://foggie.fogworks.io/api/pms/product

## Usage 

* In windows 

   1. Open  cmd.exe first
   2. Drag the foggiechecker.exe to the cmd.exe

* In Mac or Linux
   run the following command in the terminal

```sh

./foggiechecker

选项：
      --version   显示版本号                                              [布尔]
  -s, --sender    Sender Email Address                                    [必需]
  -p, --password  Sender Email Password                                   [必需]
  -r, --receiver  Receiver Email Address                                  [必需]
  -d, --debug     Debug Mode
      --help      显示帮助信息                                            [布尔]

缺少这些必须的选项：sender, password, receiver
```

## Support Sender Email Service

Sender email service are supported by [nodemailer](https://nodemailer.com/smtp/well-known/)

## Example

```sh

## debug if the sender can send email
./foggiechecker -s xxx@hotmail.com -p PASSWORDHERE -r xxxx@qq.com --debug

```