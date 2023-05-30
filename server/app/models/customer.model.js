const Customer = function (customer) {
    (this.user_id = customer.user_id),
        (this.code = customer.code),
        (this.name = customer.name),
        (this.phone = customer.phone),
        (this.email = customer.email),
        (this.address = customer.address),
        (this.active = customer.active),
        (this.web_page = customer.web_page),
        (this.image = customer.image),
        (this.created_at = customer.created_at),
        (this.updated_at = customer.updated_at);
};

module.exports = Customer;
