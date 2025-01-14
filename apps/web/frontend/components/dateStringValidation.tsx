import { isValid, parse } from 'date-fns'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']

export const getDate = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) {
    return undefined
  }
  const usedFormat = acceptedDateFormats.find((format) => isValid(parse(dateString, format, new Date())))
  if (!usedFormat) {
    return undefined
  }
  return parse(dateString, usedFormat, new Date().getDate())
}

export const dateStringValidation = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())
