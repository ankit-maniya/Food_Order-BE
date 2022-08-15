// OTP
export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}

export const onRequestOtp = async (otp: number, to: number) => {
    var accountSid = ''; // Your Account SID from www.twilio.com/console
    var authToken = '';   // Your Auth Token from www.twilio.com/console

    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);

    try {
        const otpResponse = await client.messages
            .create({
                body: `Your OTP is ${otp}`,
                from: '+15005550009',
                to: `+91${to}`
            })

        return otpResponse
    } catch (error) {
        console.log('error twilio :: ', error)
        return error
    }
}