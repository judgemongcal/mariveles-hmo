const monthYearEl = document.querySelector("#monthYear");
const datesEl = document.querySelector(".dates");
const calPrevBtn = document.querySelector("#cal-prev-btn");
const calNextBtn = document.querySelector("#cal-submit-btn");
const timeslotDiv = document.querySelector(".time-slots");
const buttonDiv = document.querySelector(".cal-btn-blk");
const form = document.querySelector(".multi-step-form");

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
let chosenTime;
const tempTimeSlots = [
	"8:00 AM",
	"9:00 AM",
	"10:00 AM",
	"11:00 AM",
	"12:00 PM",
	"1:00 PM",
	"2:00 PM",
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
		datesHTML += `<button class="date inactive" data-month-key=${prevDate.getMonth()}>${prevDate.getDate()}</button>`;
	}

	for (let i = 1; i <= totalDays; i++) {
		const date = new Date(currentYear, currentMonth, i);
		// console.log(date.toDateString());
		const activeClass = date > new Date();
		datesHTML += `<button class='date ${
			activeClass ? "active" : "inactive"
		}' data-month-key=${date.getMonth()}>${i}</button>`;
	}

	for (let i = lastDayIndex + 1; i < 7; i++) {
		datesHTML += `<button class="date inactive"></button>`;
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
	const activeDates = document.querySelectorAll(".date");
	activeDates.forEach((date) =>
		date.addEventListener("click", (e) => getDayVal(e)),
	);
};

const getDayVal = (e) => {
	e.preventDefault();
	console.log(
		`Selected Month is: ${currentDate.getMonth()} Selected Day is: ${
			e.target.innerHTML
		} Selected Year is : ${currentDate.getFullYear()}`,
	);
	chosenDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		Number(e.target.innerHTML),
	);
	console.log(chosenDate);

	chosenDate && showTime(e);
};

const showTime = (e) => {
	e.preventDefault();
	timeslotDiv.innerHTML = "";
	tempTimeSlots.map((time, index) => {
		const container = document.createElement("div");
		index % 2 == 0
			? container.classList.add("time", "time-open")
			: container.classList.add("time", "time-taken");
		container.innerHTML = time;
		timeslotDiv.appendChild(container);
	});

	handleTimeOpen(e);
};

const handleTimeOpen = (e) => {
	e.preventDefault();
	const openTime = document.querySelectorAll(".time-open");
	openTime.forEach((time) =>
		time.addEventListener("click", () => getTime(time)),
	);
};

const getTime = (option) => {
	const timeSelected = option.innerHTML;
	const chosenTime = timeSelected;
	console.log(chosenTime);

	chosenTime && showSubmitBtn();
};

const showSubmitBtn = () => {
	buttonDiv.style.display = "flex";
};

// USER DATA FETCHING

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const firstName = document.querySelector("#first_name").value;
	const lastName = document.querySelector("#last_name").value;
	const email = document.querySelector("#last_name").value;
	const phoneNum = document.querySelector("#p_number").value;
	const appointment = document.querySelector("#appt").value;
	console.log(firstName, lastName, email, phoneNum, appointment);
});

updateCalendar();
