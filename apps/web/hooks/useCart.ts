import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartData {}

export function useCart(userId: string) {
  const { data, error, mutate } = useSWR<CartData>(
    `/api/cart?userId=${userId}`,
    fetcher
  );

  const addToCart = async (item: CartItem) => {
    await fetch(`/api/cart?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
    mutate();
  };

  // Implement other cart operations

  return {
    cart: data,
    isLoading: !error && !data,
    isError: error,
    addToCart,
    // Other cart operations
  };
}
