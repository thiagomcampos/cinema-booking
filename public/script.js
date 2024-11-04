const sessionsDiv = document.getElementById("sessions");
const seatsDiv = document.getElementById("seats");
const reserveBtn = document.getElementById("reserveBtn");

const userId = Math.floor(Math.random() * 999) + 1;
const currentUserIdSpan = document.getElementById("currentUserId");
currentUserIdSpan.textContent = userId;

let selectedSessionId = null;
let selectedSeats = [];

fetch("/sessions")
  .then((res) => res.json())
  .then((sessions) => {
    sessionsDiv.innerHTML = "";
    sessions.forEach((session) => {
      const sessionElement = document.createElement("div");
      sessionElement.textContent = `${session.movie_title} - ${session.showtime}`;
      sessionElement.classList.add(
        "cursor-pointer",
        "hover:bg-gray-200",
        "p-2"
      );
      sessionElement.addEventListener("click", () => {
        clearSelection();
        displaySeats(session.id);
        selectedSessionId = session.id;

        const previouslySelected = sessionsDiv.querySelector(".font-bold");
        if (previouslySelected) {
          previouslySelected.classList.remove("font-bold");
        }

        sessionElement.classList.add("font-bold");
      });
      sessionsDiv.appendChild(sessionElement);
    });
  })
  .catch((error) => console.error("Error fetching sessions:", error));

const displaySeats = (sessionId) => {
  fetch(`/sessions/${sessionId}/seats`)
    .then((res) => res.json())
    .then((seats) => {
      seatsDiv.innerHTML = "";
      seats.forEach((seat) => {
        const seatElement = document.createElement("div");
        seatElement.textContent = seat.seat_number;
        seatElement.classList.add(
          "border",
          "border-gray-300",
          "p-2",
          "text-center"
        );

        if (seat.isReserved) {
          seatElement.classList.add("bg-red-300");
        } else {
          seatElement.classList.add("bg-gray-300", "cursor-pointer");

          seatElement.addEventListener("click", () =>
            toggleSeatSelection(seatElement)
          );
        }
        seatsDiv.appendChild(seatElement);
      });
    })
    .catch((error) => console.error("Error fetching seats:", error));
};

const toggleSeatSelection = (seatElement) => {
  const seatNumber = seatElement.textContent;
  if (selectedSeats.includes(seatNumber)) {
    selectedSeats.splice(selectedSeats.indexOf(seatNumber), 1);
    seatElement.classList.remove("bg-green-500");
  } else {
    selectedSeats.push(seatNumber);
    seatElement.classList.add("bg-green-500");
  }
  reserveBtn.style.display = selectedSeats.length > 0 ? "block" : "none";
};

reserveBtn.addEventListener("click", () => {
  fetch(`/sessions/${selectedSessionId}/seats/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, seats: selectedSeats }),
  })
    .then((res) => {
      if (res.ok) {
        alert("Seats reserved successfully!");
      } else {
        res.json().then((data) => alert(`Error: ${data.error}`));
      }
    })
    .catch((error) => console.error("Error reserving seats:", error))
    .finally(() => {
      clearSelection();
      displaySeats(selectedSessionId);
    });
});

const clearSelection = () => {
  selectedSeats = [];
  reserveBtn.style.display = "none";
};
