export enum PaymentTypes {
  PAY_MONO = 1,
  BANK_TRANSFER,
  COD,
}

export const PaymentMap = Object.values(PaymentTypes)
  .filter((item) => !isNaN(+item))
  .map((value) => {
    switch (value) {
      case PaymentTypes.BANK_TRANSFER:
        return {
          key: "Bank Transfer",
          value: PaymentTypes.BANK_TRANSFER,
        };
      case PaymentTypes.PAY_MONO:
        return {
          key: "Mono",
          value: PaymentTypes.PAY_MONO,
        };
      case PaymentTypes.COD:
        return {
          key: "COD",
          value: PaymentTypes.COD,
        };
    }
  });
