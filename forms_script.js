const form = document.getElementById('formJS');

form.addEventListener('submit', 
    function(event){
        event.preventDefault();

        const firstName = document.getElementById('firstname');
        const lastName = document.getElementById('lastname');
        const region = document.getElementById('region');
        const province = document.getElementById('province');
        const barangay = document.getElementById('barangay');
        const city = document.getElementById('city');
        const postalCode = document.getElementById('postalcode');
        const address = document.getElementById('address');
        const mobileNo = document.getElementById('mobile');
        const email = document.getElementById('email');
        const apptType = document.getElementById('appointment');
        const date = document.getElementById('date');
        const time = document.getElementById('time');

        const fnValue = firstName.value;
        const lnValue = lastName.value;
        const regionValue = region.value;
        const provinceValue = province.value;
        const barangayValue = barangay.value;
        const cityValue = city.value;
        const postalCodeValue = postalCode.value;
        const addressValue = address.value;
        const mobileNoValue = mobileNo.value;
        const emailValue = email.value;
        const apptTypeValue = apptType.value;
        const dateValue = date.value;
        const timeValue = time.value;

        console.log(fnValue);
        console.log(lnValue);
        console.log(regionValue);
        console.log(provinceValue);
        console.log(barangayValue);
        console.log(cityValue);
        console.log(postalCodeValue);
        console.log(addressValue);
        console.log(mobileNoValue);
        console.log(emailValue);
        console.log(apptTypeValue);
        console.log(dateValue);
        console.log(timeValue);
    });