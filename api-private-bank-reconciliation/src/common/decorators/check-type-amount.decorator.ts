import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface 
} from "class-validator";
import { TYPE } from "../../transaction/constant/type.constant";

export function CheckTypeAmount(property: string, validationOptions?: ValidationOptions) {
    console.log(123123)
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'CheckTypeAmount' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return (value > 0 && relatedValue === TYPE.DEPOSIT) || ((value < 0 || value === 0) && relatedValue === TYPE.WITHDRAW);
    }
    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must match ${relatedPropertyName} exactly`;
    }
}