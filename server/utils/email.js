const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);

module.exports = class Email {
  constructor(user, token) {
    this.to = user.email;
    this.userName = user.userName;
    this.token = token;
  }

  async sendEmail(template, subject) {
    let html;

     if(template === 'Welcome') {
        html = `
        <h1>Hi ${this.userName}</h1>
        <p> Welcome to PostBook, we're glad to have you</p> 
        <p> We're all a big familiy here, so make sure to post your idea!!</p>
        <p> Use this Token (valid for only 10 minutes) for activate Your account: ${this.token}</p>
        <p>Do <strong>NOT</strong> share this with other</p>
        <hr />
        <p> If you need any help with publishing your next post, please don't hesitate to contact me!</p>
        <p> - Parth Katrodia, CEO</p>
      `
    } else if (template === 'PasswordReset') {
        html = `
        <h1>Hi ${this.userName}</h1>
        <p>Forgot your password? Use this token for One Time verification: ${this.token}</p>
        <p>Do <strong>NOT</strong> share this with other</p>
        <hr />
        <p>If you didn't forget your password, please ignore this email!</p>
        `
    } else if (template === 'BlackListUser') {
      html = `
      <h1>Hi ${this.userName}</h1>
      <p>You has been <strong>BLACKLISTED</strong> and not allowed further access to your account with that all post of your's were also been BLACKLISTED </P>
      <hr />
      <p> If you need any clarification, please don't hesitate to contact me!</p>
      <p> - Parth Katrodia, CEO</p>
      `
  }

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: this.to,
        subject,
        html
      };

     await sgMail.send(emailData);
   }

  async sendWelcome() {
    await this.sendEmail('Welcome', 'Welcome to the PostBook Family!');
  }

  async sendPasswordReset() {
    await this.sendEmail(
      'PasswordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendBlackList() {
    await this.sendEmail(
      'BlackListUser',
      'You are blackListed'
    );
  }
};
