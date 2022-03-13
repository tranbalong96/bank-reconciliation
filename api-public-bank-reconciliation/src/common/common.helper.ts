export class CommonHelper {
    public static isValidDate(date: Date): boolean {
        return date instanceof Date && !isNaN(date.valueOf());
    }

    public static isValidNumber(number: number) : boolean {
        return !isNaN(number.valueOf())
    }
}