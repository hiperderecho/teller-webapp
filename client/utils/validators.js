var validators = {};

validators.text        = /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/;
validators.fullname    = /^[a-záéíóúÁÉÍÓÚñÑA-Z]([-']?[a-záéíóúÁÉÍÓÚñÑA-Z]+)*( [a-záéíóúÁÉÍÓÚñÑA-Z]([-']?[a-záéíóúÁÉÍÓÚñÑA-Z]+)*)+$/;
validators.email       = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
validators.phonenumber = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{2,3}$/;
validators.dni         = /[0-9]{4,8}/;
validators.address     = /[a-zA-ZáéíóúÁÉÍÓÚñÑ 0-9]+/

module.exports = validators;