const Device = function (device) {
  (this.imei = device.imei),
    (this.seri = device.seri),
    (this.note = device.note),
    (this.created_at = device.created_at),
    (this.updated_at = device.updated_at);
};

module.exports = Device;
