# Andmarski's hour counting discord bot is here!

## What is this discord bot used for?
Let's say you are the head of some faction/company on an RP server or you just have a group of people and you need to manage the time they spend working. With the help of this bot you can do it easily with a few clicks.

## How to install?
1. Make sure you have NodeJS and MySQL database installed on your bot hosting/server device.
2. Download this repository and go to `template/` folder, then import `template.database.sql` file to your database and prepare `config.json` with instructions given in `template.config.txt` and save it in main bot directory.
3. Open bot directory in NodeJS command line and type `node .` (Personally I recommend installing [forever](https://www.npmjs.com/package/forever) for better bot stability - then always run it with `forever .`)
4. Don't forget to type `/send_messages` command on any channel on you discord server. (it's also described in `template.config.txt`)

## How to use?

### Default user:
1. Go to channel marked as `duty_status` and click the button under message with users on duty. By first time after a short while you'll be added to database and you'll receive option select message.
2. Click on the option select menu and select duty option (you can select up to **two** indicating first selected option as main). After selecting option the bot will show you on list with selected options.

![Entering duty](https://cdn.discordapp.com/attachments/1001079843217219624/1123596290136223744/image.png)

3. You can change duty options by selecting them again from the select menu. When you're done with your job - you want to exit duty - just simply click again button from first point. The bot will send you a message with a summary of the time spent on duty.

![Exiting duty](https://cdn.discordapp.com/attachments/1001079843217219624/1123601686452240435/image.png)
![Summary message](https://cdn.discordapp.com/attachments/1001079843217219624/1123602058185027604/image.png)

The color of the bar depends on whether the user has made the norm of hours or the norm to receive a bonus.

### Admin user:
You have access to all the functions of a regular user and:
* You can delete manually user from duty (useful when someone forgets to go off duty themselves)
* You are also able to change actual user duty options by selecting them from select menu on their thread

![Changing options and deleting from duty](https://cdn.discordapp.com/attachments/1001079843217219624/1123608070044516362/image.png)

* You can add and subtract hours from each log by entering bot user discord thread and clicking edit button.

![Editing log](https://cdn.discordapp.com/attachments/1001079843217219624/1123610490103418970/image.png)

Keep in mind that the button will be locked until the user goes off duty also there are limitations:
   * A maximum of **24 hours** can be added to one log.
   * The maximum amount of log time can be subtracted, so the subtraction result is **equals 0**.
    
#### Example       
| Time on duty | Hours to add/subtract  | Required input | Result in log        |
|--------------|------------------------|----------------|----------------------|
| 1h 23m 0s    | 2h 23m 0s              | 2:23:00        | 1:23:00 (+2:34:00)   |
| 8h 35m 7s    | -0h 40m 0s             | -0:40:00       | 8:35:07 (-0:40:00)   |
| 0h 0m 3s     | Add max value          | 24:00:00       | 0:00:03 (24:00:00)   |
| 10h 1m 1s    | Subtract max value     | -10:01:01      | 10:01:01 (-10:01:01) |
| 1h 1h 1s     | -2h 2m 2s              | -2:02:02       | none (error)         |
        
* You can summarize the time on duty of all users (it's called **week summary** but can be done in any time) by clicking button below week summary message and confirming it.

![Week summary](https://cdn.discordapp.com/attachments/757372887425613894/1123618699073552414/image.png)

* You can delete user from database in **three ways**:
    * By deleting message with user thread in `thread_channel` (don't work for older messages! - caused by Discord)
    * By deleting his thread in `thread_channel`
    * By kicking him from the server

## Comments
* Bot is in alpha version, so it contains only Polish language version. If you need a translation to your language add me and let me know on Discord `andmarski`.
* Sometimes the message on the channel `duty_status` may not refresh in a timely manner. If something like this occurs then just wait. (caused by Discord)
