const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.autoDeposit = functions.https.onRequest(async (req, res) => {
  const { userId, amount, txId } = req.body;
  if(!userId || !amount || !txId) return res.status(400).send("Missing parameters");

  const userRef = admin.database().ref(`users/${userId}`);
  const snapshot = await userRef.once("value");
  if(!snapshot.exists()) return res.status(404).send("User not found");

  // TODO: Verify txId with payment API
  const verified = true;
  if(verified){
    const balance = snapshot.val().balance || 0;
    await userRef.update({ balance: balance + parseFloat(amount) });
    return res.status(200).send("Deposit successful");
  } else {
    return res.status(400).send("Transaction not verified");
  }
});
