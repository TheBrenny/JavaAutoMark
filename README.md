# JAM

This is something new.

## Installation for Dev

1. Install [NodeJS](https://nodejs.dev).

2. Run the following commands:
```bash
git clone https://github.com/TheBrenny/JavaAutoMark.git
cd JavaAutoMark
git checkout develop
npm install --save-dev
```

3. Copy-pasta `_sample.env` as `.env` (so you have 2 files)
4. Open `.env` and change:
```
MYSQL_URL=mysql://user:pass@jam/jam
```
to
```
MYSQL_URL=<the link I sent in chat>
```

## Running for Dev

1. Make sure you're on the `develop` branch
   1. `git checkout develop`
2. If you're using VSCode, click the debug tab on the left (probably the 3rd tab, the one with the bug and Run arrow)
3. Click the green arrow next to `gulp debug` or `just run`
   1. Choosing `gulp debug` will make sure any changes you make in the code will be automatically updated in your browser. This has the cost of taking a bit longer to start up and using a bit more memory. This might also whinge with an error, just click `Debug anyway`.
   2. Choosing `just run` will make the server start up fastest, and use less memory. **First time running? Use this!**
4. If it's your first time running the app, you'll be prompted to install some configuration options.
   1. Just follow the bouncing ball
5. Open up `localhost:80` (or `localhost:81` for browser sync)
6. Log in with `admin:admin`


## Making changes

1. Make sure you're on the `develop` branch:
   1. `git checkout develop`
2. Run `git pull` to get the latest changes (or press whatever button in your IDE to get the latest changes)
3. Make your edits to the code
4. Run `git commit -m "your message here"` to commit your changes - or do it in your IDE's UI.
5. Run `git push` to push your changes to everyone. -- Or do this in your IDE UI.
   1. I actually don't know what happens if 2 people push different commits at the same time, so we'll find out!
