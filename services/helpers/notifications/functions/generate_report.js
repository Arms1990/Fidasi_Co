module.exports = generate_report = async (req, res) => {
    return res.json({
        type: 'externalLink',
        url: `https://www.youtube.com/watch?v=SapKgQPs7nU`
    });
}
