import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import { selectAllAddresses } from "../../../../store/selectors/addressSelectors";
import { UPDATE_ADDRESS } from "../../../../graphql/mutations/address.mutations";
import { setAddresses } from "../../../../store/addressSlice";
import type { imagesAddresses } from "../../../../constants/address";
import { selectUserId } from "../../../../store/selectors/userSelectors";
import { useFetchMyCards } from "../../../../graphql/hooks/useCards";

type DisableAddressButtonProps = {
  id: string;
  setIsDeleteOpen?: (open: boolean) => void;
  myCard?: boolean;
};

type AddressType = keyof typeof imagesAddresses;

const defaultFormData = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  gps: "",
  complement: "",
  photo: "",
  type: "house" as AddressType,
  active: true,
  confirmed: false,
  visited: false,
  customName: "",
};

const allowedKeys = Object.keys(defaultFormData).concat("id") as (
  | keyof typeof defaultFormData
  | "id"
)[];

/** Sanitize an address object for GraphQL input */
type AddressInput = typeof defaultFormData & { id?: string };

function sanitizeAddressInput(data: Partial<AddressInput>): AddressInput {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => allowedKeys.includes(key as keyof AddressInput))
      .map(([k, v]) => [k, v ?? ""])
  ) as AddressInput;
}

const DisableAddressButton: React.FC<DisableAddressButtonProps> = ({
  id,
  setIsDeleteOpen,
  myCard,
}) => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAllAddresses);
  const userId = useSelector(selectUserId);

  const address = useMemo(
    () => addresses.find((a) => a.id === id) || null,
    [addresses, id]
  );
  const [formData, setFormData] = useState({ ...defaultFormData });

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        ...sanitizeAddressInput(address),
      }));
    }
  }, [address]);

  const { fetchMyCards } = useFetchMyCards();
  const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: ({ updateAddress }) => {
      dispatch(
        setAddresses({
          addresses: addresses.map((a) =>
            a.id === updateAddress.address.id ? updateAddress.address : a
          ),
        })
      );
      if (myCard) fetchMyCards({ variables: { myCardsId: userId } });
      toast.success("¡Dirección modificada exitosamente!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(`¡Error al modificar la dirección! ${error.message}`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const handleToggleActive = async () => {
    if (!address) return;

    const input = {
      ...sanitizeAddressInput({ ...formData, id }),
      active: !address.active,
    };

    try {
      await updateAddress({ variables: { input } });
    } catch (error) {
      console.error("Erro ao alterar status da address:", error);
    } finally {
      setOpenModal(false);
    }
  };

  if (!address) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpenModal(true);
          setIsDeleteOpen?.(false);
        }}
        className={`${
          !address.active
            ? "bg-blue-600 text-white"
            : "bg-destaque-primary text-primary-drk"
        } w-full rounded-lg text-sm shadow-md mt-2 py-3 cursor-pointer transition hover:opacity-90`}
      >
        {!address.active ? "Activar la dirección" : "Desactivar la dirección"}
      </button>

      {openModal && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-primary-drk rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Deseas {address.active ? "DESACTIVAR" : "ACTIVAR"} esta
              dirección?
            </h2>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
              Esta acción puede revertirse más tarde.
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
                onClick={handleToggleActive}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Sí, confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisableAddressButton;
