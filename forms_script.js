const monthYearEl = document.querySelector("#monthYear");
const datesEl = document.querySelector(".dates");
const timeslotDiv = document.querySelector(".time-slots");
const buttonDiv = document.querySelector(".cal-btn-blk");
const form = document.querySelector(".multi-step-form");
const confirmModal = document.querySelector(".modal");
const exitModal = document.querySelector(".exit-modal");
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
let calPrevBtn = document.querySelector("#calPrevBtn");
let calNextBtn = document.querySelector("#calNextBtn");
let chosenDay, chosenTime, chosenType;
let activeDates;

const slide2NextBtn = document.querySelector(".next-slide-2");

// CARD SLIDER
const multiStepForm = document.querySelector("[data-multi-step]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
let currentStep = formSteps.findIndex((step) => {
	return step.classList.contains("active");
});

if (currentStep < 0) {
	currentStep = 0;
	showCurrentStep();
}

multiStepForm.addEventListener("click", (e) => {
	let incrementor;
	if (e.target.matches("[data-next]")) {
		incrementor = 1;
	} else if (e.target.matches("[data-previous]")) {
		incrementor = -1;
	}

	if (incrementor == null) return;

	const inputs = [...formSteps[currentStep].querySelectorAll("input")];
	const allValid = inputs.every((input) => input.reportValidity());
	if (allValid) {
		currentStep += incrementor;
		showCurrentStep();
	}
});

formSteps.forEach((step) => {
	step.addEventListener("animationend", (e) => {
		formSteps[currentStep].classList.remove("hide");
		e.target.classList.toggle("hide", !e.target.classList.contains("active"));
	});
});

function showCurrentStep() {
	formSteps.forEach((step, index) => {
		step.classList.toggle("active", index === currentStep);
	});
}

// CALENDAR
let currentDate = new Date();
let chosenDate;
const tempTimeSlots = [
	"8:00 AM",
	"9:00 AM",
	"10:00 AM",
	"11:00 AM",
	"2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM"
];

const updateCalendar = () => {
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	const firstDay = new Date(currentYear, currentMonth, 1);
	const lastDay = new Date(currentYear, currentMonth + 1, 0);
	const totalDays = lastDay.getDate();
	const firstDayIndex = firstDay.getDay();
	const lastDayIndex = lastDay.getDay();
	// console.log(firstDayIndex);

	const monthYearString = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});
	monthYearEl.textContent = monthYearString;

	let datesHTML = "";

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += `<button class="date inactive" data-month-key=${prevDate.getMonth()} disabled>${prevDate.getDate()}</button>`;
    }

    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date > new Date();
        datesHTML += `<button class='date ${
            activeClass ? "active" : "inactive"
        }' data-month-key=${date.getMonth()} ${activeClass ? "" : "disabled"}>${i}</button>`;
    }

    for (let i = lastDayIndex + 1; i < 7; i++) {
        datesHTML += `<button class="date inactive" disabled></button>`;
    }

    datesEl.innerHTML = datesHTML;

    getActiveDates();
};

calPrevBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	updateCalendar();
});

calNextBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	updateCalendar();
});

const getActiveDates = () => {
	activeDates = document.querySelectorAll(".date");
	activeDates.forEach((date) =>
		date.addEventListener("click", (e) => getDayVal(date, e)),
	);
};

const getDayVal = (date, e) => {
	// e.preventDefault();
	activeDates.forEach((activeDate) => {
		activeDate.style.backgroundColor = "";
	});

	date.style.backgroundColor = "var(--primary)";
	console.log(
		`Selected Month is: ${currentDate.getMonth()} Selected Day is: ${
			e.target.innerHTML
		} Selected Year is : ${currentDate.getFullYear()}`,
	);
	chosenDay = Number(e.target.innerHTML);
	chosenDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		Number(e.target.innerHTML),
	);
	console.log(chosenDate);

	chosenDate && showTime(e);
};

const showTime = async (e) => {
    e.preventDefault();
    timeslotDiv.innerHTML = "";

    try {
        const response = await fetch("http://localhost:3000/getAppointments");
        const bookedAppointments = await response.json();

        const previousDay = new Date(chosenDate);
        previousDay.setDate(previousDay.getDate() + 1);

        tempTimeSlots.forEach((time, index) => {
            const container = document.createElement("div");
            const isTimeTaken = bookedAppointments.some(appointment => 
                appointment.date === previousDay.toISOString() &&
                appointment.time === time &&
                appointment.appointmentType === chosenType // Add this condition
            );

            container.classList.add("time", isTimeTaken ? "time-taken" : "time-open");
            container.innerHTML = time;
            timeslotDiv.appendChild(container);

            container.addEventListener("click", () => {
                if (!isTimeTaken) {
                    toggleTimeColor(container);
                } else {
                    showTimeTaken();
                }
            });

            // Disable the button if the time is taken
            if (isTimeTaken) {
                container.disabled = true;
                container.style.pointerEvents = "none";
            }
        });

    } catch (error) {
        console.error("Error fetching booked appointments:", error);
    }

    handleTimeOpen(e);
};


const toggleTimeColor = (container) => {

    const clickedButtons = document.querySelectorAll(".time-clicked");

    clickedButtons.forEach(button => {
        button.classList.remove("time-clicked");
        button.style.backgroundColor = "#26ab7a";
        button.style.color = ""; 
    });

    container.classList.toggle("time-clicked");

    container.style.backgroundColor = "#f2af29";
    container.style.color = "black";

    container.style.transition = "background-color 0.3s ease";
};

const handleTimeOpen = (e) => {
    e.preventDefault();
    const openTime = document.querySelectorAll(".time-open");
    openTime.forEach((time) =>
        time.addEventListener("click", () => {
            toggleTimeColor(time);
            getTime(time);
        }),
    );
};

const appointmentTypeSelect = document.querySelector("#appt");
appointmentTypeSelect.addEventListener("change", async (e) => {
    e.preventDefault();
    chosenType = e.target.value;

    if (chosenDate) {
        await showTime(e);
    } else {
        updateCalendar();
    }
});



const getTime = (option) => {
	const timeSelected = option.innerHTML;
	chosenTime = timeSelected;
	console.log(chosenTime);

	chosenTime && showSubmitBtn();
};

const showSubmitBtn = () => {
	buttonDiv.style.display = "flex";
};

// USER DATA FETCHING

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.querySelector("#first_name").value;
    const lastName = document.querySelector("#last_name").value;
    const email = document.querySelector("#email").value; 
    const phoneNum = document.querySelector("#p_number").value;
    const appointment = document.querySelector("#appt").value;

    const formData = {
        fname: firstName,
        lname: lastName,
        email: email,
        phoneNum: phoneNum,
        appointmentType: appointment,
		date: chosenDate,
		time: chosenTime
    };

	showModal(appointment);
});


// MODAL

const showModal = (appointment) => {
    confirmModal.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("modal-card", "shadow-1");
    div.innerHTML = `
        <h2>You are about to schedule your appointment.</h2>
        <div class="appt-details">
            <p class="gradient-text"><strong>Scheduled Date</strong></p>
            <p>${
                months[chosenDate.getMonth()]
            } ${chosenDay}, ${chosenDate.getFullYear()}</p>
            <p class="gradient-text"><strong>Scheduled Time</strong></p>
            <p>${chosenTime}</p>
            <p class="gradient-text"><strong>Appointment Type</strong></p>
            <p>${appointment}</p>
        </div>
        <h3>Would you like to proceed?</h3>
        <div class="modal-btn-blk">
            <button
                type="button"
                class="prev-btn"
                id="modal-prev-btn"
                data-previous
            >
                Back
            </button>
            <button type="button" class="submit-btn" id="modal-submit-btn">
                Submit
            </button>
        </div>
    `;
    confirmModal.appendChild(div);
    confirmModal.style.display = "flex";

    const submitBtn = confirmModal.querySelector("#modal-submit-btn");
    submitBtn.addEventListener("click", () => {
        hideModal(); // Hide the modal before making the POST request
        submitEmail();
        submitFormData(appointment);
    });

    confirmModal
        .querySelector("#modal-prev-btn")
        .addEventListener("click", hideModal);
};

const submitFormData = async (appointment) => {
    const formData = {
        fname: document.querySelector("#first_name").value,
        lname: document.querySelector("#last_name").value,
        email: document.querySelector("#email").value,
        phoneNum: document.querySelector("#p_number").value,
        appointmentType: appointment,
        date: chosenDate,
        time: chosenTime,
    };

    try {
        const response = await fetch("http://localhost:3000/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('Form submitted successfully!');
        } else {
            console.error('Failed to submit the form:', response.statusText);
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
};


const hideModal = () => {
	confirmModal.style.display = "none";
};

const showTimeTaken = () => {
    const timeTakenDisplay = document.querySelector("#timeTakenDisplay");

    if (timeTakenDisplay) {
        timeTakenDisplay.innerHTML = "Sorry, this time slot has been taken. Please choose another one.";
        timeTakenDisplay.style.display = "block";
    }
};



const showConfirm = () => {
	// e.preventDefault();

	confirmModal.style.display = "none";
	const div = document.createElement("div");
	div.classList.add("modal-card", "shadow-1");
	div.innerHTML = `
	<h2>Your appointment has been scheduled!</h2>
	
	<h3>Please check your email for the confirmation and for other updates.<br>See you soon!</h3>
	<div class="modal-btn-blk">
		<button type="button" class="submit-btn" id="modal-finish-btn">
			Finish
		</button>
	</div>
	`;
	exitModal.appendChild(div);
	exitModal.style.display = "flex";

	const finishBtn = exitModal.querySelector("#modal-finish-btn");
	finishBtn.addEventListener("click", exitPage);
};



const exitPage = () => {
	window.location.href = "../index_files/index.html";
};

updateCalendar();


const fname = document.getElementById('first_name');
const lname = document.getElementById('last_name');
const email = document.getElementById('email');
const pnumber = document.getElementById('p_number');
const appointment = document.getElementById('appt');
const submit = document.getElementsByClassName('form-contact')[0];

const submitEmail = () => {
    console.log('Clicked');

    //email code
    //password: 7B47E11A97D1EFA58893972C75E3D5A2082B
    //security token: a1d681a7-0d20-4dea-804d-13aa4c97743c
    let emailBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
    
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                color: #333;
            }
    
            h2 {
                text-align: center;
                margin-bottom: 20px;
            }
    
            p {
                color: #666;
                margin-bottom: 10px;
            }
    
            b {
                color: #000;
            }
    
            a {
                color: #007bff;
                text-decoration: underline;
                font-weight: bold;
            }
    
            a:hover {
                text-decoration: underline;
            }
    
            .table-container {
                width: 100%;
            }
    
            .table-row {
                display: table-row;
            }
    
            .table-cell {
                display: table-cell;
                padding: 8px;
            }

            .auto-msg {
                text-align: center;
                margin-top: 20px;
            }

            /* Improved Footer Styles */
            .footer {
                margin-top: 20px;
                text-align: left;
                background-color: #f4f4f4;
                padding: 20px;
                border-radius: 8px;
            }
    
            .footer p {
                margin: 0;
            }
    
            .footer-address {
                margin-top: 10px;
            }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>
    <body>
        <div class="email-container">
            <h2>Appointment Confirmation</h2>
            <div class="table-container">
                <div class="table-row">
                    <div class="table-cell"><b>Full Name:</b></div>
                    <div class="table-cell">${fname.value} ${lname.value}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell"><b>Email:</b></div>
                    <div class="table-cell">${email.value}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell"><b>Phone No.:</b></div>
                    <div class="table-cell">${pnumber.value}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell"><b>Appointment Type:</b></div>
                    <div class="table-cell">${appointment.value}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell"><b>Chosen Date:</b></div>
                    <div class="table-cell">${months[chosenDate.getMonth()]} ${chosenDay}, ${chosenDate.getFullYear()}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell"><b>Chosen Time:</b></div>
                    <div class="table-cell">${chosenTime}</div>
                </div>
            </div>
            
            <p>Thank you for choosing our services. We look forward to seeing you at the scheduled appointment.</p>
    
            <p>As part of the appointment process, please download and fill out the <a href="https://drive.google.com/open?id=1HNi4sPml8anNcOW1HmLrBJib7lOFIb86&usp=drive_copy" class="btn"> PhilHealth Konsulta Form A4 </a>  and present it to one of our personnel.</p>

            <p>Please review the details above. If there are any discrepancies or if you need to make changes, feel free to contact us.</p>
    
            <p>Best regards,<br> <br> Mariveles Municipal Health Office</p>
    
            <div class="footer">
                <p>Contact Number: (047) 935 5696</p>
            <div class="footer-address">
                <p>Address:</p>
                <p>CFPR+934, Mariveles Municipal Hall Building</p>
                <p>Roman Superhighway, Mariveles, 2105 Bataan, Philippines</p>
            </div>
        </div>

        <p class="auto-msg"><b>This is an auto-generated email. DO NOT REPLY TO THIS MESSAGE </b></p>
        </div>
    </body>
    </html>
    
    
    
    `
    Email.send({
        SecureToken : "a1d681a7-0d20-4dea-804d-13aa4c97743c",
        To : email.value,
        From : "georgeconstante.sebastian.cics@ust.edu.ph",
        Subject : "MHO Appointment System - Confirmation Notification ",
        Body : emailBody,
    }).then(

      message => {
        console.log(message);
      }
    );
    showConfirm();
    console.log('Email Sent!');
}



