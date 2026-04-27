import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCartTotals } from "@/utils/pricing";

const useCartInfo = () => {
    const [quantity, setQuantity] = useState(0);
    const [ total, setTotal] = useState(0);
    const { cart_products } = useSelector((state) => state.cart);

    useEffect(() => {
        const cart = getCartTotals(cart_products);
        setQuantity(cart.quantity);
        setTotal(cart.total);
    }, [cart_products])
    return {
        quantity,
        total,
        setTotal,
    }
}

export default useCartInfo;
