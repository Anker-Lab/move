/* =========================================
   MOVE26 PROGRAM
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       ELEMENTER
    ========================================= */

    const buttons = document.querySelectorAll(
        ".knapper button[data-program]"
    );

    const programs = document.querySelectorAll(
        ".program-view[data-program]"
    );

    const nowButton = document.getElementById(
        "nowButton"
    );


    /* =========================================
       SKIFT PROGRAM
    ========================================= */

    function switchProgram(programName) {

        // Fjern aktiv status fra knapper
        buttons.forEach(button => {

            button.classList.remove("active");

        });


        // Skjul alle programmer
        programs.forEach(program => {

            program.classList.remove("active");

        });


        // Find knappen
        const activeButton = document.querySelector(
            `.knapper button[data-program="${programName}"]`
        );


        // Find programmet
        const activeProgram = document.querySelector(
            `.program-view[data-program="${programName}"]`
        );


        // Aktivér knap
        if (activeButton) {

            activeButton.classList.add("active");

        }


        // Vis program
        if (activeProgram) {

            activeProgram.classList.add("active");

        }

    }


    /* =========================================
       KNAPPER
    ========================================= */

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const programName = button.dataset.program;

            switchProgram(programName);

        });

    });


    /* =========================================
       FIND EVENTS
    ========================================= */

    function getEvents(program = null) {

        // Hvis vi sender et program med
        if (program) {

            return [
                ...program.querySelectorAll(
                    ".timeline-event[data-start][data-end], " +
                    ".single-event[data-start][data-end]"
                )
            ];

        }


        // Alle events på hele siden
        return [
            ...document.querySelectorAll(
                ".timeline-event[data-start][data-end], " +
                ".single-event[data-start][data-end]"
            )
        ];

    }


    /* =========================================
       OPDATER EVENTS
    ========================================= */

    function updateEvents() {

        const now = new Date();

        const events = getEvents();


        events.forEach(event => {

            const start = new Date(
                event.dataset.start
            );

            const end = new Date(
                event.dataset.end
            );


            // Fjern tidligere status
            event.classList.remove(
                "current",
                "past"
            );


            // Event foregår lige nu
            if (now >= start && now < end) {

                event.classList.add("current");

            }


            // Event er afsluttet
            else if (now >= end) {

                event.classList.add("past");

            }

        });

    }


    /* =========================================
       AKTIVE EVENTS
    ========================================= */

    function getActiveEvents(events) {

        const now = new Date();


        return events.filter(event => {

            const start = new Date(
                event.dataset.start
            );

            const end = new Date(
                event.dataset.end
            );


            return now >= start && now < end;

        });

    }


    /* =========================================
       NÆSTE EVENT
    ========================================= */

    function getNextEvent(events) {

        const now = new Date();


        return events.find(event => {

            const start = new Date(
                event.dataset.start
            );


            return start > now;

        });

    }


    /* =========================================
       FIND EVENT TIL "NU"
    ========================================= */

    function getEventForNow() {

        // Find aktivt program
        const activeProgram = document.querySelector(
            ".program-view.active"
        );


        if (!activeProgram) {

            return null;

        }


        // Events KUN i det aktive program
        const events = getEvents(activeProgram);


        if (!events.length) {

            return null;

        }


        // Find aktive events
        const activeEvents = getActiveEvents(events);


        // Hvis noget sker nu
        if (activeEvents.length) {

            return activeEvents[0];

        }


        // Find næste event
        const nextEvent = getNextEvent(events);


        if (nextEvent) {

            return nextEvent;

        }


        // Hvis alt er slut
        return events[
            events.length - 1
        ];

    }


    /* =========================================
       SCROLL TIL NU
    ========================================= */

    function scrollToNow() {

        updateEvents();


        const targetEvent = getEventForNow();


        if (!targetEvent) {

            return;

        }


        // Scroll
        targetEvent.scrollIntoView({

            behavior: "smooth",
            block: "center"

        });


        // Animation
        targetEvent.classList.remove(
            "focus"
        );


        // Genstart animation
        void targetEvent.offsetWidth;


        targetEvent.classList.add(
            "focus"
        );


        setTimeout(() => {

            targetEvent.classList.remove(
                "focus"
            );

        }, 900);

    }


    /* =========================================
       NU-KNAP
    ========================================= */

    if (nowButton) {

        nowButton.addEventListener(
            "click",
            scrollToNow
        );

    }


    /* =========================================
       START
    ========================================= */

    updateEvents();


    /* =========================================
       OPDATER HVER 10. SEKUND
    ========================================= */

    setInterval(() => {

        updateEvents();

    }, 10000);


});