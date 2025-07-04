export const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const scales = ["", "Thousand", "Million", "Billion"];

  const chunk = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + chunk(n % 100) : "")
    );
  };

  const chunks: string[] = [];
  let scale = 0;

  while (num > 0) {
    const chunkNum = num % 1000;
    if (chunkNum !== 0) {
      const chunkWords =
        chunk(chunkNum) + (scales[scale] ? " " + scales[scale] : "");
      chunks.unshift(chunkWords);
    }
    num = Math.floor(num / 1000);
    scale++;
  }

  return chunks.join(" ").trim() + " Only";
};
