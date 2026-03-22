// ============================================
// Level 3: Actions — Hints
// ============================================

// Task 3.1: Form Action
// ----------------------
// 1. In React 19, <form> accepts an async function as the `action` prop
// 2. The action function receives FormData as its argument
// 3. Use formData.get('fieldName') to extract values
// 4. Example:
//    async function handleSubmit(formData: FormData) {
//      const name = formData.get('name') as string
//      await saveToServer(name)
//    }
//    <form action={handleSubmit}>

// Task 3.2: useActionState
// -------------------------
// 1. Import useActionState from 'react'
// 2. It replaces useFormState from 'react-dom' (canary)
// 3. Signature: const [state, formAction, isPending] = useActionState(fn, initialState)
// 4. The action fn receives (previousState, formData) and returns new state
// 5. Use isPending to show loading indicators
// 6. Return error messages or success status from the action

// Task 3.3: useFormStatus
// ------------------------
// 1. Import useFormStatus from 'react-dom'
// 2. Must be used inside a component that is a child of <form>
// 3. Returns { pending, data, method, action }
// 4. Use pending to disable button or show spinner
// 5. Create a separate SubmitButton component:
//    function SubmitButton() {
//      const { pending } = useFormStatus()
//      return <button disabled={pending}>{pending ? 'Sending...' : 'Submit'}</button>
//    }

// Task 3.4: Progressive Enhancement
// -----------------------------------
// 1. Use native form elements (input, select) with name attributes
// 2. Add hidden inputs for state that needs to be submitted
// 3. The form should work without JavaScript using standard form submission
// 4. With JS enabled, React enhances the form with async actions
// 5. Use useActionState to manage form state
// 6. The key: form works via standard POST without JS, but is enhanced with React when JS loads

export {}
