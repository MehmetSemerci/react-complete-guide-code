import { createEntityAdapter } from '@reduxjs/toolkit';
import { cartActions } from './cart-slice';
import { uiActions } from './ui-slice';

export const sendCartData = (cart) => {
	return async (dispatch) => {
		dispatch(
			uiActions.showNotification({
				status: 'pending',
				title: 'Sending...',
				message: 'Sending cart data!',
			})
		);
		const sendRequest = async () => {
			const response = await fetch(
				'https://dev-project-mse-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
				{
					method: 'PUT',
					body: JSON.stringify({
						totalQuantity: cart.totalQuantity,
						items: cart.items,
					}),
				}
			);

			if (!response.ok) {
				throw new Error('Sending cart data failed');
			}
		};

		try {
			await sendRequest();
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error',
					message: 'Sending cart data failed!',
				})
			);
		}
		dispatch(
			uiActions.showNotification({
				status: 'success',
				title: 'Success',
				message: 'Sent cart data successfully!',
			})
		);
	};
};

export const loadCartData = () => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(
				'https://dev-project-mse-default-rtdb.europe-west1.firebasedatabase.app/cart.json'
			);

			if (!response.ok) {
				throw new Error('Data fetch failed!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const cartData = await fetchData();
			dispatch(
				cartActions.replaceCart({
					items: cartData.items || [],
					totalQuantity: cartData.totalQuantity,
				})
			);
			dispatch(
				uiActions.showNotification({
					status: 'success',
					title: 'Success',
					message: 'Fetch cart data successfully!',
				})
			);
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error',
					message: 'Fetching cart data failed!',
				})
			);
		}
	};
};
