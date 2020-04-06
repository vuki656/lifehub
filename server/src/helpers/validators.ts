import { emailRegEx } from './variables'

export const validateInput = (username, email, password, confirmPassword) => {
    const errors: { username: string, email: string, password: string, passwordConfirmation: string } = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    }

    //: TODO TRIM USERNAME AND EMAIL

    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    if (email.trim() === '') {
        errors.email = 'Email must not be empty'
    } else {
        if (!email.match(emailRegEx)) {
            errors.email = 'Email must be a valid email address'
        }
    }

    if (password === '') {
        errors.password = 'Password must not empty'
    } else if (password !== confirmPassword) {
        errors.passwordConfirmation = 'Passwords must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    }
}
