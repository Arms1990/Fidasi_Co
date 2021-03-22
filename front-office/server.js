const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist', 'fidasi')));

app.get('*', function (req, res) {
	return res.sendFile(path.join(__dirname, 'dist', 'fidasi', 'index.html'));
});

app.listen(process.env.FRONT_OFFICE_PORT, () => {
	console.log(`Listening on *:${process.env.FRONT_OFFICE_PORT}`);
});
