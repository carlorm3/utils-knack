Utils for Knack

Template for Knack library in js: template.js

Api Call Library: knack-api.js

```
try{
    new_object = await lib.create('object_xx',JSON.stringify(payload));
    updated_object = await lib.update('object_xx','id_object',JSON.stringify(payload));
    deleted_object = await lib.delete('object_xx','id_object');
    object = await lib.findById('object_xx','id_object');
    objects = await lib.find('object_xx',[{field: 'field_xx',operator:'is',value: 'field_value'}]);
}catch(e){
    console.log(e)
}
```
