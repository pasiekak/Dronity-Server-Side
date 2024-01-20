const STATUSMSGS = {
  1: {
    id: 1,
    shortMessage: "Utworzone",
    longMessage: "Zlecenie zostało utworzone. Gdy pojawi się chętny operator do jego wykonania zostaniesz o tym poinformowany.",
    class: "created",
  },
  2: {
    id: 2,
    shortMessage: "Oczekujące",
    longMessage: "Zlecenie oczekuje na wybranie odpowiedniego operatora do jego wykonania.",
    class: "considerable",
  },
  3: {
    id: 3,
    shortMessage: "Zatwierdzone",
    longMessage: "Zlecenie posiada potwierdzonego operatora i oczekuje na wykonanie.",
    class: "accepted",
  },
  4: {
    id: 4,
    shortMessage: "Wykonane",
    longMessage: "Zlecenie zostało wykonane",
    class: "done",
  },
  5: {
    id: 5,
    shortMessage: "Anulowane",
    longMessage: "Zlecenie zostało tymczasowo anulowane",
    class: "canceled",
  },
};

module.exports = STATUSMSGS;
