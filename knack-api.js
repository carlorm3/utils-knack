async function(){
    try{
        new_object = await lib.create('object_xx',JSON.stringify(payload));
        updated_object = await lib.update('object_xx','id_object',JSON.stringify(payload));
        deleted_object = await lib.delete('object_xx','id_object');
        object = await lib.findById('object_xx','id_object');
        objects = await lib.find('object_xx',[{field: 'field_xx',operator:'is',value: 'field_value'}]);
    }catch(e){
        console.log(e)
    }
}

//payload example:

{
    'field_1':'value_field_1',
    'field_2':'value_field_2'
    'field_3': { //date
            date:"02/08/2013",
            hours:11,
            minutes:47,
            am_pm:"pm"
    },
    'field_4': { //address
          street:"123 Fake St",
          street2:"Apt 2",
          city:"Amonate",
          state:"VA",
          zip:"24601"
    }

}


//operator

//General is, is not, is blank, is not blank
//Date/Time (single date)	is, is not, is during the current, is during the previous, is during the next, is before the previous, is after the next, is before, is after, is today, is today or before, is today or after, is before today, is after today, is before current time, is after current time, is blank, is not blank
//Number	is, is not, higher than, lower than, is blank, is not blank

//multiple rules
var filters = {
  'match': 'or', //and
  'rules': [
             {
               'field':'field_1',
               'operator':'is',
               'value':'Dodgit'
             },
             {
               'field':'field_1',
               'operator':'is blank'
             }
           ]
};


//callback mode
lib.create(
    'object_xx',
    JSON.stringify(payload)
)
.then((response) => {
    console.log(response)
})
.fail((error) => {
    console.log(error)
});

lib.update(
    'object_xx',
    'id_object',
    JSON.stringify(payload)
)
.then((response) => {
    console.log(response)
})
.fail((error) => {
    console.log(error)
});

lib.delete(
    'object_xx',
    'id_object'
)
.then((response) => {
    console.log(response)
})
.fail((error) => {
    console.log(error)
});

lib.findById(
    'object_xx',
    'id_object'
)
.then((response) => {
    console.log(response)
})
.fail((error) => {
    console.log(error)
});

lib.find(
    'object_xx',
    [
        {
            field: 'field_xx',
            operator:'is',
            value: 'field_value'
        }
    ]
)
.then((response) => {
    console.log(response)
})
.fail((error) => {
    console.log(error)
});
