import React from 'react';

import Input from '../components/UI/Input/Input';

export const updateObject = (oldObject, updatedProperties) => {
   return {
      ...oldObject,
      ...updatedProperties
   };
}; 

 const checkValidaty =  (value, rules) =>  {
   let isValid = true;
   if(!rules) {
       return true;
   }
   if(rules.required) {
       isValid = value.trim() !== '' && isValid;
   }
   if(rules.minLength) {
       isValid = value.length >= rules.minLength && isValid;
   }
   if(rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
}

if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
}

if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid
}
   return isValid;
};


export const createField = (elementType, type, placeholder, validation) => {
    let field = {
       elementType,
       elementConfig: {
           type,
           placeholder
       },
       value: '',
       validation,
       valid: false,
       touched: false
   }
   return field;
};



 const inputChangedHandler = (form, func, event, controlName) => {
    const updatedControls = updateObject(form, {
     [controlName]: updateObject(form[controlName], {
        value: event.target.value,
        valid: checkValidaty(event.target.value, form[controlName].validation),
        touched: true
    }) 
  }); 
  func(updatedControls);
};

export const createForm = (Form, setForm) => {
    let formElementsArray = [];
    for(let key in Form) {
        formElementsArray.push({
            id: key,
            config: Form[key]
        });
       }

       let form = formElementsArray.map(formElement => (
        <Input 
        key={formElement.id}
        elementType={formElement.config.elementType} 
        elementConfig={formElement.config.elementConfig} 
        value={formElement.config.value} 
        inValid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => inputChangedHandler(Form, setForm, event, formElement.id)}/>
    ));

    return form ;
};

