const Feedback = function (feedback) {
    (this.msg = feedback.msg),
        (this.email = feedback.email),
        (this.phone = feedback.phone),
        (this.status = feedback.status),
        (this.created_at = feedback.created_at);
};

module.exports = Feedback;
