"use client";
import React from "react";
import TextInput from "@/ui/TextInput";
import Button from "@/ui/Button";

interface CardDetailsProps {
  cardNumber: [string, React.Dispatch<React.SetStateAction<string>>];
  expiryDate: [string, React.Dispatch<React.SetStateAction<string>>];
  cvv: [string, React.Dispatch<React.SetStateAction<string>>];
  cardName: [string, React.Dispatch<React.SetStateAction<string>>];

  // Billing states
  name: [string, React.Dispatch<React.SetStateAction<string>>];
  address: [string, React.Dispatch<React.SetStateAction<string>>];
  city: [string, React.Dispatch<React.SetStateAction<string>>];
  stateName: [string, React.Dispatch<React.SetStateAction<string>>];
  zipCode: [string, React.Dispatch<React.SetStateAction<string>>];
  country: [string, React.Dispatch<React.SetStateAction<string>>];
}

export default function CardDetails({
  cardNumber,
  expiryDate,
  cvv,
  cardName,
  name,
  address,
  city,
  stateName,
  zipCode,
  country,
}: CardDetailsProps) {
  const [cardNumberValue, setCardNumber] = cardNumber;
  const [expiryValue, setExpiryDate] = expiryDate;
  const [cvvValue, setCvv] = cvv;
  const [cardNameValue, setCardName] = cardName;

  const [billingName, setName] = name;
  const [billingAddress, setAddress] = address;
  const [billingCity, setCity] = city;
  const [billingState, setState] = stateName;
  const [billingZip, setZipCode] = zipCode;
  const [billingCountry, setCountry] = country;

  const fillRandomDetails = () => {
    // Payment details
    const randomCardNumber = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const randomExpiry = `${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}/${String(new Date().getFullYear() + 3).slice(-2)}`;
    const randomCvv = String(Math.floor(100 + Math.random() * 900));
    const names = ["John Doe", "Jane Smith", "Alex Brown", "Chris Johnson"];
    const randomName = names[Math.floor(Math.random() * names.length)];

    // Billing details
    const addresses = [
      "123 Main St",
      "456 Oak Lane",
      "789 Pine Avenue",
      "101 Maple Road",
    ];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston"];
    const states = ["NY", "CA", "IL", "TX"];
    const countries = ["USA", "Canada", "UK", "Australia"];

    setCardNumber(randomCardNumber);
    setExpiryDate(randomExpiry);
    setCvv(randomCvv);
    setCardName(randomName);

    setName(randomName);
    setAddress(addresses[Math.floor(Math.random() * addresses.length)]);
    setCity(cities[Math.floor(Math.random() * cities.length)]);
    setState(states[Math.floor(Math.random() * states.length)]);
    setZipCode(String(Math.floor(10000 + Math.random() * 90000)));
    setCountry(countries[Math.floor(Math.random() * countries.length)]);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-700">Payment Method</h2>
        <Button  onClick={fillRandomDetails}>
          Fill Random Details
        </Button>
      </div>

      <div className="space-y-4">
        <label
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer
            bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
            border border-[var(--color-input-border)]
            hover:border-gray-400 focus-within:ring-2 focus-within:ring-[var(--color-brand)]`}
        >
          <input type="radio" name="payment" className="mr-3" defaultChecked />
          <span className="font-medium">Credit Card</span>
        </label>

        <label
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer
            bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
            border border-[var(--color-input-border)]
            hover:border-gray-400 focus-within:ring-2 focus-within:ring-[var(--color-brand)]`}
        >
          <input type="radio" name="payment" className="mr-3" />
          <span className="font-medium">UPI</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Card Number"
          state={[cardNumberValue, setCardNumber]}
          value={cardNumberValue}
          placeholder="Card Number"
        />
        <TextInput
          label="Expiry Date"
          state={[expiryValue, setExpiryDate]}
          value={expiryValue}
          placeholder="MM/YY"
        />
        <TextInput
          label="CVV"
          state={[cvvValue, setCvv]}
          value={cvvValue}
          placeholder="CVV"
        />
        <TextInput
          label="Card Name"
          state={[cardNameValue, setCardName]}
          value={cardNameValue}
          placeholder="Cardholder Name"
        />
      </div>
    </>
  );
}
