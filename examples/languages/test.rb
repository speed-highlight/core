require 'json'

=begin
Petit exporteur de factures, sans dependance externe : un hash par ligne.
=end

module Billing
  DEFAULT_VAT = 0.17
  $exported = 0

  class Invoice
    attr_reader :number, :lines

    @@registry = {}

    def initialize(number, currency: 'EUR')
      @number = number
      @currency = currency
      @paid = false
      @sent_at = nil
      @lines = []
      @@registry[number] = self
    end

    # FIXME: un "#" dans un libelle n'ouvre pas de commentaire, et ce end ne ferme rien
    def add(label, cents, vat = DEFAULT_VAT)
      raise ArgumentError, 'montant negatif' if cents < 0
      @lines << { label: label, cents: cents, vat: (cents*vat).round }
      self
    end

    def empty?
      @lines.empty?
    end

    def total
      @lines.sum { |line| line[:cents] + line[:vat] }
    end

    def save!
      @paid = true
      $exported += 1
      File.write("invoice-#{@number}.json", JSON.generate(@lines))
    end
  end
end

facture = Billing::Invoice.new(0x412)

{ 'Mastering # 3' => 4500, "Mixage \"deluxe\"" => 12_000 }.each do |label, cents|
  facture.add(label, cents)
end

banner = <<~TEXT
  Facture ##{facture.number}
  Total TTC : #{facture.total/100.0} EUR
TEXT

puts facture.empty? ? 'rien a exporter' : banner
facture.save! unless facture.empty?
