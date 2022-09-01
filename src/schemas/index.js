import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const passwordExplanation = "Lösenordet måste innehålla minst 8 tecken, en versal, en gemen, och ett nummer";

export const registerSchema = yup.object().shape({
	username: yup.string().min(2).required("Användarnamn krävs"),
	password: yup
		.string()
		.matches(passwordRules, passwordExplanation)
		.required("Lösenord krävs")
});

export const loginSchema = yup.object().shape({
	username: yup.string().required("Användarnamn krävs"),
	password: yup.string().required("Lösenord krävs")
});

const financesExplanation = "Fältet kan bara innehålla nummer";

export const financesSchema = yup.object().shape({
	salary: yup.number().typeError(financesExplanation).required("Fältet måste vara ifyllt"),
	rent: yup.number().typeError(financesExplanation),
	homeinsurance: yup.number().typeError(financesExplanation),
	food: yup.number().typeError(financesExplanation),
	petrol: yup.number().typeError(financesExplanation),
	carinsurance: yup.number().typeError(financesExplanation),
	slcard: yup.number().typeError(financesExplanation),
	mobilebill: yup.number().typeError(financesExplanation),
	tobacco: yup.number().typeError(financesExplanation),
	clothes: yup.number().typeError(financesExplanation),
	training: yup.number().typeError(financesExplanation),
	stocks: yup.number().typeError(financesExplanation),
	savings: yup.number().typeError(financesExplanation),
	pension: yup.number().typeError(financesExplanation)
});

export const financesSchema2 = yup.object().shape({
	rent: yup.number().typeError(financesExplanation),
	homeinsurance: yup.number().typeError(financesExplanation),
	food: yup.number().typeError(financesExplanation),
	petrol: yup.number().typeError(financesExplanation),
	carinsurance: yup.number().typeError(financesExplanation),
	slcard: yup.number().typeError(financesExplanation),
	mobilebill: yup.number().typeError(financesExplanation),
	tobacco: yup.number().typeError(financesExplanation),
	clothes: yup.number().typeError(financesExplanation),
	training: yup.number().typeError(financesExplanation),
	stocks: yup.number().typeError(financesExplanation),
	savings: yup.number().typeError(financesExplanation),
	pension: yup.number().typeError(financesExplanation)
});

export const paymentSchema = yup.object().shape({
	paymentTitle: yup.string().required("Kan inte vara tom"),
	paymentAmount: yup.number().typeError("Detta fält kan bara innehålla nummer").required("Kan inte vara tom")
});
