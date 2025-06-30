import { useSelector } from "react-redux";
import { selectAllCards } from "../../store/selectors/cardsSelectors";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPinCheck,
  Send,
  SendHorizontal,
  UserCheck,
} from "lucide-react";
import DesignatedCard from "./components/DesignatedCard";
import ButtonSteps from "../Address/ui/ButtonSteps";
import { ProgressSteps, Step } from "../Address/ui/ProgressSteps";
import DesignatedUsersCards from "./components/DesignatedUsersCards";
import type { ButtonTypeOption, Card } from "./types/card.types";

const buttonTypeOptions: ButtonTypeOption[] = [
  {
    value: "notDesignate",
    label: "Tarjeta no enviada",
    icon: <Send size={18} />,
  },
  {
    value: "designate",
    label: "Tarjeta asignada",
    icon: <SendHorizontal size={18} />,
  },
];

type FormStep = 1 | 2;

const AsignateCard = () => {
  const cards = useSelector(selectAllCards) as Card[];

  const [selectedButton, setSelectedButton] = useState("notDesignate");
  const [selectedNotAssigned, setSelectedNotAssigned] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);
  const [step, setStep] = useState<FormStep>(1);
  const [selectedCardUserId, setSelectedCarUserId] = useState<
    string | undefined
  >(undefined);

  const filteredCards = Object.values(cards).filter((card) =>
    selectedNotAssigned.includes(card.id)
  );

  const notAssignedCards = useMemo(() => {
    return cards.filter((card) => card.endDate);
  }, [cards]);

  const assignedCards = useMemo(() => {
    return cards.filter((card) => !card.endDate);
  }, [cards]);

  const toggleSelect = (id: string, isAssigned: boolean) => {
    if (isAssigned) {
      setSelectedAssigned((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedNotAssigned((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const nextStep = () => step < 2 && setStep((prev) => (prev + 1) as FormStep);
  const prevStep = () => step > 1 && setStep((prev) => (prev - 1) as FormStep);

  return (
    <div className="w-full min-h-screen bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt p-4 max-w-2xl mx-auto rounded-2xl">
      {/* Cabeçalho */}
      <div className="flex flex-col mb-6 gap-2 p-2 text-lg">
        <div className="flex items-center gap-4 mb-4">
          <Send className="text-[var(--color-destaque-primary)]" size={24} />
          <h1 className="text-2xl font-semibold">Asignar Tarjetas</h1>
        </div>

        <p>{cards?.length} tarjetas creadas</p>
        <p>{notAssignedCards?.length} tarjetas no enviadas</p>
      </div>
      {step === 1 && (
        <div className="flex flex-col  items-center gap-3 mb-6">
          <div className="flex justify-center gap-4 w-full">
            {buttonTypeOptions.map(({ value, label, icon }) => {
              const isActive = selectedButton === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedButton(value)}
                  className={`flex items-center justify-center gap-2 border rounded-lg p-3 transition ${
                    isActive
                      ? "bg-destaque-second text-white dark:bg-tertiary-lgt dark:text-black"
                      : "border-gray-400 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
          <div className="w-full">
            {selectedButton === "notDesignate" ? (
              <div>
                <DesignatedCard
                  cards={notAssignedCards}
                  selectedNotAssigned={selectedNotAssigned}
                  toggleSelect={toggleSelect}
                  designated={false}
                />
              </div>
            ) : (
              <>
                <DesignatedCard
                  cards={assignedCards}
                  selectedAssigned={selectedAssigned}
                  toggleSelect={toggleSelect}
                  designated={true}
                />
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <DesignatedUsersCards
            filteredCards={filteredCards}
            selectedCardUserId={selectedCardUserId}
            setSelectedCarUserId={setSelectedCarUserId}
            setSelectedNotAssigned={setSelectedNotAssigned}
          />
        </div>
      )}

      <div className="px-6 pb-6 flex justify-between flex-col">
        <div className="p-4 ">
          <ProgressSteps currentStep={step} totalSteps={2}>
            <Step active={step >= 1}>
              <span className="hidden sm:inline">Direccion</span>
              <MapPinCheck />
            </Step>
            <Step active={step >= 2}>
              <span className="hidden sm:inline">User</span>
              <UserCheck />
            </Step>
          </ProgressSteps>
        </div>

        <div className="flex justify-between">
          {step > 1 ? (
            <ButtonSteps
              onClick={prevStep}
              variant="secondary"
              disabled={false}
            >
              <ChevronLeft size={18} /> Voltar
            </ButtonSteps>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <ButtonSteps
              onClick={nextStep}
              disabled={selectedButton === "designate" && true}
            >
              {selectedButton === "designate"
                ? "Elige una tarjeta no asignada"
                : "Elegir usuario"}
              <ChevronRight size={18} />
            </ButtonSteps>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AsignateCard;
