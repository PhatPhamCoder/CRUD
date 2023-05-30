const Module = function (module) {
  this.parent_id = module.parent_id;
  this.name = module.name;
  this.link = module.link;
  this.component = module.component;
  this.icon = module.icon;
  this.publish = module.publish;
  this.sort = module.sort;
  this.created_at = module.created_at;
  this.updated_at = module.updated_at;
};

module.exports = Module;
