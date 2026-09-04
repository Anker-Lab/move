/* =========================
    KNAPPER ØVERST
========================= */
const buttons = document.querySelectorAll(".knapper button");
const programs = document.querySelectorAll(".program-view");

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {

        // Fjern active fra alle knapper
        buttons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Gør den valgte knap aktiv
        button.classList.add("active");

        // Skjul alle programmer
        programs.forEach(program => {
            program.classList.remove("active");
        });

        // Vis det program, der passer til knappen
        programs[index].classList.add("active");
    });
});


/* =========================
   PROGRAMMET
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const events = [
    ...document.querySelectorAll(".timeline-event[data-start][data-end]"),
    ...document.querySelectorAll(".sunday[data-start][data-end]")
];

    const nowButton = document.getElementById("nowButton");

    if (!events.length) return;


    // --------------------------------------------------
    // FIND AKTIVE EVENTS
    // --------------------------------------------------

    function getActiveEvents() {

        const now = new Date();

        return events.filter(event => {

            const start = new Date(event.dataset.start);
            const end = new Date(event.dataset.end);

            return now >= start && now < end;
        });
    }


    // --------------------------------------------------
    // FIND NÆSTE EVENT
    // --------------------------------------------------

    function getNextEvent() {

        const now = new Date();

        return events.find(event => {
            const start = new Date(event.dataset.start);

            return start > now;
        });
    }


    // --------------------------------------------------
    // OPDATER PROGRAMMET
    // --------------------------------------------------

    function updateProgram() {

        const now = new Date();

        events.forEach(event => {

            const start = new Date(event.dataset.start);
            const end = new Date(event.dataset.end);

            event.classList.remove("current", "past");

            // Aktiv lige nu
            if (now >= start && now < end) {

                event.classList.add("current");

            }

            // Afsluttet
            else if (now >= end) {

                event.classList.add("past");

            }

        });

        return getActiveEvents();
    }


    // --------------------------------------------------
    // FIND HVAD "NU" SKAL GÅ TIL
    // --------------------------------------------------

    function getEventForNow() {

        const activeEvents = getActiveEvents();

        // Hvis der er flere aktive,
        // vælger vi den øverste i HTML'en.
        if (activeEvents.length > 0) {
            return activeEvents[0];
        }


        // Hvis der ikke er noget aktivt endnu,
        // finder vi det næste kommende punkt.
        const nextEvent = getNextEvent();

        if (nextEvent) {
            return nextEvent;
        }


        // Hvis hele programmet er overstået,
        // går vi til det sidste punkt.
        return events[events.length - 1];
    }


    // --------------------------------------------------
    // SCROLL TIL "NU"
    // --------------------------------------------------

    function scrollToNow() {

        updateProgram();

        const targetEvent = getEventForNow();

        if (!targetEvent) return;


        targetEvent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        // Lille animation så man kan se,
        // hvilket punkt vi hoppede til.

        targetEvent.classList.remove("focus");

        void targetEvent.offsetWidth;

        targetEvent.classList.add("focus");


        setTimeout(() => {
            targetEvent.classList.remove("focus");
        }, 900);
    }


    // --------------------------------------------------
    // NU-KNAP
    // --------------------------------------------------

    if (nowButton) {

        nowButton.addEventListener("click", () => {
            scrollToNow();
        });

    }


// --------------------------------------------------
// START
// --------------------------------------------------

updateProgram();


// Automatisk scroll ved indlæsning
setTimeout(() => {

    const activeEvents = getActiveEvents();

    // Hvis der ikke er noget aktivt,
    // bliver vi bare øverst på siden.
    if (activeEvents.length === 0) {
        return;
    }

    // Første aktive event = øverste aktive
    const targetEvent = activeEvents[0];

    targetEvent.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}, 500);


const sunday = document.querySelector(".sunday[data-start][data-end]");

function updateSunday() {
    if (!sunday) return;

    const now = new Date();

    const start = new Date(sunday.dataset.start);
    const end = new Date(sunday.dataset.end);

    if (now >= start && now < end) {
        sunday.classList.add("current");
    } else {
        sunday.classList.remove("current");
    }
}


    // --------------------------------------------------
    // OPDATER LIVE
    // --------------------------------------------------

    setInterval(() => {
        updateProgram();
        updateSunday();
    }, 10000);

});


// --------------------------------------------------
// DOWNLOAD PROGRAM
// --------------------------------------------------

const PROGRAM_FILES = {
    voksen: {
        image: "/assets/images/program/9e6ea793-0713-496b-9c96-abdb03fbc521.jpeg",
        pdf: "/assets/images/program/9e6ea793-0713-496b-9c96-abdb03fbc521.pdf"
    },

    tween: {
        image: null,
        pdf: null
    },

    mini: {
        image: null,
        pdf: null
    }
};


document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".program-view").forEach(programView => {

        const programType = programView.dataset.program;
        const files = PROGRAM_FILES[programType];

        if (!files) return;

        const saveButton = programView.querySelector(".save-program-button");
        const pdfButton = programView.querySelector(".download-pdf-button");


        // --------------------------------------------------
        // GEM PROGRAM
        // --------------------------------------------------

        if (!files.image) {

            saveButton.disabled = true;

        } else {

            saveButton.addEventListener("click", async () => {

                try {

                    const response = await fetch(files.image);
                    const blob = await response.blob();

                    const file = new File(
                        [blob],
                        "MOVE26-program.jpeg",
                        {
                            type: "image/jpeg"
                        }
                    );


                    // Hvis telefonen understøtter deling af filer
                    if (
                        navigator.share &&
                        navigator.canShare &&
                        navigator.canShare({
                            files: [file]
                        })
                    ) {

                        await navigator.share({
                            files: [file],
                            title: "MOVE26 program",
                            text: "MOVE26 program"
                        });

                    } else {

                        // Desktop / browser uden Share API
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "MOVE26-program.jpeg";

                        document.body.appendChild(link);
                        link.click();
                        link.remove();

                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 1000);
                    }

                } catch (error) {

                    console.error(
                        "Kunne ikke gemme programmet:",
                        error
                    );

                }

            });

        }


        // --------------------------------------------------
        // DOWNLOAD PDF
        // --------------------------------------------------

        if (!files.pdf) {

            pdfButton.disabled = true;

        } else {

            pdfButton.addEventListener("click", () => {

                window.open(files.pdf, "_blank");

            });

        }

    });

});