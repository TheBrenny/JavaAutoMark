const sessionSchema = {
    account: {
        zid: -1,
        fname: "",
        lname: "",
        email: "",
        authed: false,
        badLogin: false,
        badReg: false,
        loginCount: 0
    },
};

const general = {
    add(key, value) {
        this[key] = value;
    },
    remove(key) {
        delete this[key];
    }
};

const account = {
    getAccount() {
        if (this.account === undefined) this.account = Object.assign({}, sessionSchema.account);
        return this.account;
    },
    setAccount(zid, fname, lname, email) {
        if (zid < 0 || zid == null) {
            this.account = Object.assign({}, sessionSchema.account);
        } else {
            this.getAccount().zid = zid;
            this.getAccount().fname = fname;
            this.getAccount().lname = lname;
            this.getAccount().email = email;
            this.getAccount().authed = true;
            this.getAccount().badLogin = false;
            this.getAccount().badRegister = false;
            this.getAccount().loginCount = 0;
        }
    },
    name() {
        return this.getAccount().fname;
    },
    isAuthed() {
        return this.getAccount().authed;
    },
    getBadLogin() {
        let b = this.getAccount().badLogin;
        this.getAccount().badLogin = false;
        return b;
    },
    badLogin(message) {
        this.getAccount().badLogin = message || true;
    },
    getBadRegister() {
        let b = this.badReg;
        this.badReg = false;
        return b;
    },
    badRegister(message) {
        this.badReg = message || true;
    },
    loginAttempt() {
        this.getAccount().loginCount++;
    },
    getLoginCount() {
        return this.getAccount().loginCount;
    }
};

const functions = {
    ...general,
    ...account,
};

module.exports = function (req) {
    let func = {};
    for (let f in functions) func[f] = functions[f].bind(req.session);
    return Object.assign(req.session, functions);
};