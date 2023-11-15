// const monthYearEl = document.querySelector("#monthYear");
// const datesEl = document.querySelector(".dates");
// const calPrevBtn = document.querySelector("#calPrevBtn");
// const calNextBtn = document.querySelector("#calNextBtn");

// let currentDate = new Date();

// const updateCalendar = () => {
// 	const currentYear = currentDate.getFullYear();
// 	const currentMonth = currentDate.getMonth();

// 	const firstDay = new Date(currentYear, currentMonth, 1);
// 	const lastDay = new Date(currentYear, currentMonth + 1, 0);
// 	const totalDays = lastDay.getDate();
// 	const firstDayIndex = firstDay.getDay();
// 	const lastDayIndex = lastDay.getDay();

// 	const monthYearString = currentDate.toLocaleString("default", {
// 		month: "long",
// 		year: "numeric",
// 	});
// 	monthYearEl.textContent = monthYearString;

// 	let datesHTML = "";

// 	for (let i = firstDayIndex; i > 1; i--) {
// 		const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
// 		datesHTML += `<div class='date inactive'>${prevDate.getDate()}</div>`;
// 	}

// 	for (let i = 1; i <= totalDays; i++) {
// 		const date = new Date(currentYear, currentMonth, i);
// 		const activeClass =
// 			date.toDateString() === currentDate.toDateString() ? "active" : "";
// 		datesHTML += `<div class='date ${activeClass}">${i}</div>`;
// 	}

// 	for (let i = 1; i <= 7 - lastDayIndex; i++) {
// 		const nextDate = new Date(currentYear, currentMonth + 1, i);
// 		datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
// 	}

// 	datesEl.innerHTML = datesHTML;
// };

// calPrevBtn.addEventListener("click", () => {
// 	currentDate.setMonth(currentDate.getMonth() - 1);
// 	updateCalendar();
// });
// calNextBtn.addEventListener("click", () => {
// 	currentDate.setMonth(currentDate.getMonth() + 1);
// 	updateCalendar();
// });

// updateCalendar();

const monthYearEl = document.querySelector("#monthYear");
const datesEl = document.querySelector(".dates");
const calPrevBtn = document.querySelector("#calPrevBtn");
const calNextBtn = document.querySelector("#calNextBtn");

let currentDate = new Date();

const updateCalendar = () => {
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	const firstDay = new Date(currentYear, currentMonth, 1);
	const lastDay = new Date(currentYear, currentMonth + 1, 0);
	const totalDays = lastDay.getDate();
	const firstDayIndex = firstDay.getDay();
	const lastDayIndex = lastDay.getDay();
	console.log(firstDayIndex);

	const monthYearString = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});
	monthYearEl.textContent = monthYearString;

	let datesHTML = "";

	for (let i = firstDayIndex; i > 0; i--) {
		const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
		datesHTML += `<div class='date inactive'>${prevDate.getDate()}</div>`;
	}

	for (let i = 1; i <= totalDays; i++) {
		const date = new Date(currentYear, currentMonth, i);
		console.log(date.toDateString());
		const activeClass =
			date.getDate() > new Date().getDate() ? "active" : "inactive";
		datesHTML += `<div class='date ${activeClass}'>${i}</div>`;
	}

	for (let i = lastDayIndex + 1; i < 7; i++) {
		datesHTML += `<div class="date inactive"></div>`;
	}

	datesEl.innerHTML = datesHTML;
};

calPrevBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	updateCalendar();
});
calNextBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	updateCalendar();
});

updateCalendar();
