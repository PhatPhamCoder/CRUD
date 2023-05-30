const User = function (user) {
  (this.parent_id = user.parent_id),
    (this.account = user.account),
    (this.password = user.password),
    (this.role_id = user.role_id),
    (this.refresh_token = user.refresh_token),
    (this.active = user.active),
    (this.expired_on = user.expired_on),
    (this.created_at = user.created_at),
    (this.updated_at = user.updated_at);
};

module.exports = User;
