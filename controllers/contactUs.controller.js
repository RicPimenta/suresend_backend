const sendGridService = require("../services/sendGrid.service");

exports.createContactUs = async (req, res) => {
  try {
    let { contactDetail, message } = req.body;
    const sendEmail = await sendGridService.sendEmail(
      `Contact Detail: ${contactDetail}\n\nMessage: ${message}`
    );
    res.json({ success: true, data: sendEmail });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
