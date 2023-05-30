const GroupDevice = function (groupDevice) {
    (this.name = groupDevice.name),
        (this.publish = groupDevice.publish),
        (this.created_at = groupDevice.created_at),
        (this.updated_at = groupDevice.updated_at);
};

module.exports = GroupDevice;
