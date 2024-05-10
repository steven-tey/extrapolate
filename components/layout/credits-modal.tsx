import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import useSWRImmutable from "swr/immutable";
import { CreditsButton } from "@/components/layout/credits-button";

const CreditsModal = ({
  showCreditsModal,
  setShowCreditsModal,
}: {
  showCreditsModal: boolean;
  setShowCreditsModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const supabase = createClient();

  const { data: products } = useSWRImmutable("get_products", async () => {
    const { data: products, error } = await supabase.rpc("get_products");

    return products;
  });

  return (
    <Modal showModal={showCreditsModal} setShowModal={setShowCreditsModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="https://precedent.dev">
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">Buy Credits</h3>
          <p className="text-sm text-gray-500">1 Image = 10 Credits</p>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          {products?.map((product) => (
            <form key={product.id}>
              <CreditsButton product={product} />
            </form>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export function useCreditsModal() {
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const CreditsModalCallback = useCallback(() => {
    return (
      <CreditsModal
        showCreditsModal={showCreditsModal}
        setShowCreditsModal={setShowCreditsModal}
      />
    );
  }, [showCreditsModal, setShowCreditsModal]);

  return useMemo(
    () => ({ setShowCreditsModal, CreditsModal: CreditsModalCallback }),
    [setShowCreditsModal, CreditsModalCallback],
  );
}
