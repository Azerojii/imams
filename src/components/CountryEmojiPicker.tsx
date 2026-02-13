'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

interface CountryEmojiPickerProps {
  onSelect: (emoji: string) => void
}

// Liste complète de tous les pays du monde
const COMMON_FLAGS = [
  { emoji: '🇦🇫', name: 'Afghanistan' },
  { emoji: '🇿🇦', name: 'Afrique du Sud' },
  { emoji: '🇦🇱', name: 'Albanie' },
  { emoji: '🇩🇿', name: 'Algérie' },
  { emoji: '🇩🇪', name: 'Allemagne' },
  { emoji: '🇦🇩', name: 'Andorre' },
  { emoji: '🇦🇴', name: 'Angola' },
  { emoji: '🇦🇬', name: 'Antigua-et-Barbuda' },
  { emoji: '🇸🇦', name: 'Arabie Saoudite' },
  { emoji: '🇦🇷', name: 'Argentine' },
  { emoji: '🇦🇲', name: 'Arménie' },
  { emoji: '🇦🇺', name: 'Australie' },
  { emoji: '🇦🇹', name: 'Autriche' },
  { emoji: '🇦🇿', name: 'Azerbaïdjan' },
  { emoji: '🇧🇸', name: 'Bahamas' },
  { emoji: '🇧🇭', name: 'Bahreïn' },
  { emoji: '🇧🇩', name: 'Bangladesh' },
  { emoji: '🇧🇧', name: 'Barbade' },
  { emoji: '🇧🇪', name: 'Belgique' },
  { emoji: '🇧🇿', name: 'Belize' },
  { emoji: '🇧🇯', name: 'Bénin' },
  { emoji: '🇧🇹', name: 'Bhoutan' },
  { emoji: '🇧🇾', name: 'Biélorussie' },
  { emoji: '🇧🇴', name: 'Bolivie' },
  { emoji: '🇧🇦', name: 'Bosnie-Herzégovine' },
  { emoji: '🇧🇼', name: 'Botswana' },
  { emoji: '🇧🇷', name: 'Brésil' },
  { emoji: '🇧🇳', name: 'Brunei' },
  { emoji: '🇧🇬', name: 'Bulgarie' },
  { emoji: '🇧🇫', name: 'Burkina Faso' },
  { emoji: '🇧🇮', name: 'Burundi' },
  { emoji: '🇰🇭', name: 'Cambodge' },
  { emoji: '🇨🇲', name: 'Cameroun' },
  { emoji: '🇨🇦', name: 'Canada' },
  { emoji: '🇨🇻', name: 'Cap-Vert' },
  { emoji: '🇨🇱', name: 'Chili' },
  { emoji: '🇨🇳', name: 'Chine' },
  { emoji: '🇨🇾', name: 'Chypre' },
  { emoji: '🇨🇴', name: 'Colombie' },
  { emoji: '🇰🇲', name: 'Comores' },
  { emoji: '🇨🇬', name: 'Congo-Brazzaville' },
  { emoji: '🇨🇩', name: 'Congo-Kinshasa' },
  { emoji: '🇰🇵', name: 'Corée du Nord' },
  { emoji: '🇰🇷', name: 'Corée du Sud' },
  { emoji: '🇨🇷', name: 'Costa Rica' },
  { emoji: '🇨🇮', name: 'Côte d\'Ivoire' },
  { emoji: '🇭🇷', name: 'Croatie' },
  { emoji: '🇨🇺', name: 'Cuba' },
  { emoji: '🇩🇰', name: 'Danemark' },
  { emoji: '🇩🇯', name: 'Djibouti' },
  { emoji: '🇩🇲', name: 'Dominique' },
  { emoji: '🇪🇬', name: 'Égypte' },
  { emoji: '🇦🇪', name: 'Émirats Arabes Unis' },
  { emoji: '🇪🇨', name: 'Équateur' },
  { emoji: '🇪🇷', name: 'Érythrée' },
  { emoji: '🇪🇸', name: 'Espagne' },
  { emoji: '🇪🇪', name: 'Estonie' },
  { emoji: '🇸🇿', name: 'Eswatini' },
  { emoji: '🇺🇸', name: 'États-Unis' },
  { emoji: '🇪🇹', name: 'Éthiopie' },
  { emoji: '🇫🇯', name: 'Fidji' },
  { emoji: '🇫🇮', name: 'Finlande' },
  { emoji: '🇫🇷', name: 'France' },
  { emoji: '🇬🇦', name: 'Gabon' },
  { emoji: '🇬🇲', name: 'Gambie' },
  { emoji: '🇬🇪', name: 'Géorgie' },
  { emoji: '🇬🇭', name: 'Ghana' },
  { emoji: '🇬🇷', name: 'Grèce' },
  { emoji: '🇬🇩', name: 'Grenade' },
  { emoji: '🇬🇹', name: 'Guatemala' },
  { emoji: '🇬🇳', name: 'Guinée' },
  { emoji: '🇬🇶', name: 'Guinée équatoriale' },
  { emoji: '🇬🇼', name: 'Guinée-Bissau' },
  { emoji: '🇬🇾', name: 'Guyana' },
  { emoji: '🇭🇹', name: 'Haïti' },
  { emoji: '🇭🇳', name: 'Honduras' },
  { emoji: '🇭🇺', name: 'Hongrie' },
  { emoji: '🇮🇳', name: 'Inde' },
  { emoji: '🇮🇩', name: 'Indonésie' },
  { emoji: '🇮🇶', name: 'Irak' },
  { emoji: '🇮🇷', name: 'Iran' },
  { emoji: '🇮🇪', name: 'Irlande' },
  { emoji: '🇮🇸', name: 'Islande' },
  { emoji: '🇮🇹', name: 'Italie' },
  { emoji: '🇯🇲', name: 'Jamaïque' },
  { emoji: '🇯🇵', name: 'Japon' },
  { emoji: '🇯🇴', name: 'Jordanie' },
  { emoji: '🇰🇿', name: 'Kazakhstan' },
  { emoji: '🇰🇪', name: 'Kenya' },
  { emoji: '🇰🇬', name: 'Kirghizistan' },
  { emoji: '🇰🇮', name: 'Kiribati' },
  { emoji: '🇽🇰', name: 'Kosovo' },
  { emoji: '🇰🇼', name: 'Koweït' },
  { emoji: '🇱🇦', name: 'Laos' },
  { emoji: '🇱🇸', name: 'Lesotho' },
  { emoji: '🇱🇻', name: 'Lettonie' },
  { emoji: '🇱🇧', name: 'Liban' },
  { emoji: '🇱🇷', name: 'Liberia' },
  { emoji: '🇱🇾', name: 'Libye' },
  { emoji: '🇱🇮', name: 'Liechtenstein' },
  { emoji: '🇱🇹', name: 'Lituanie' },
  { emoji: '🇱🇺', name: 'Luxembourg' },
  { emoji: '🇲🇰', name: 'Macédoine du Nord' },
  { emoji: '🇲🇬', name: 'Madagascar' },
  { emoji: '🇲🇾', name: 'Malaisie' },
  { emoji: '🇲🇼', name: 'Malawi' },
  { emoji: '🇲🇻', name: 'Maldives' },
  { emoji: '🇲🇱', name: 'Mali' },
  { emoji: '🇲🇹', name: 'Malte' },
  { emoji: '🇲🇦', name: 'Maroc' },
  { emoji: '🇲🇭', name: 'Îles Marshall' },
  { emoji: '🇲🇺', name: 'Maurice' },
  { emoji: '🇲🇷', name: 'Mauritanie' },
  { emoji: '🇲🇽', name: 'Mexique' },
  { emoji: '🇫🇲', name: 'Micronésie' },
  { emoji: '🇲🇩', name: 'Moldavie' },
  { emoji: '🇲🇨', name: 'Monaco' },
  { emoji: '🇲🇳', name: 'Mongolie' },
  { emoji: '🇲🇪', name: 'Monténégro' },
  { emoji: '🇲🇿', name: 'Mozambique' },
  { emoji: '🇲🇲', name: 'Myanmar' },
  { emoji: '🇳🇦', name: 'Namibie' },
  { emoji: '🇳🇷', name: 'Nauru' },
  { emoji: '🇳🇵', name: 'Népal' },
  { emoji: '🇳🇮', name: 'Nicaragua' },
  { emoji: '🇳🇪', name: 'Niger' },
  { emoji: '🇳🇬', name: 'Nigeria' },
  { emoji: '🇳🇴', name: 'Norvège' },
  { emoji: '🇳🇿', name: 'Nouvelle-Zélande' },
  { emoji: '🇴🇲', name: 'Oman' },
  { emoji: '🇺🇬', name: 'Ouganda' },
  { emoji: '🇺🇿', name: 'Ouzbékistan' },
  { emoji: '🇵🇰', name: 'Pakistan' },
  { emoji: '🇵🇼', name: 'Palaos' },
  { emoji: '🇵🇸', name: 'Palestine' },
  { emoji: '🇵🇦', name: 'Panama' },
  { emoji: '🇵🇬', name: 'Papouasie-Nouvelle-Guinée' },
  { emoji: '🇵🇾', name: 'Paraguay' },
  { emoji: '🇳🇱', name: 'Pays-Bas' },
  { emoji: '🇵🇪', name: 'Pérou' },
  { emoji: '🇵🇭', name: 'Philippines' },
  { emoji: '🇵🇱', name: 'Pologne' },
  { emoji: '🇵🇹', name: 'Portugal' },
  { emoji: '🇶🇦', name: 'Qatar' },
  { emoji: '🇨🇫', name: 'République Centrafricaine' },
  { emoji: '🇩🇴', name: 'République Dominicaine' },
  { emoji: '🇨🇿', name: 'République Tchèque' },
  { emoji: '🇷🇴', name: 'Roumanie' },
  { emoji: '🇬🇧', name: 'Royaume-Uni' },
  { emoji: '🇷🇺', name: 'Russie' },
  { emoji: '🇷🇼', name: 'Rwanda' },
  { emoji: '🇰🇳', name: 'Saint-Christophe-et-Niévès' },
  { emoji: '🇱🇨', name: 'Sainte-Lucie' },
  { emoji: '🇻🇨', name: 'Saint-Vincent-et-les-Grenadines' },
  { emoji: '🇸🇧', name: 'Salomon' },
  { emoji: '🇸🇻', name: 'Salvador' },
  { emoji: '🇼🇸', name: 'Samoa' },
  { emoji: '🇸🇲', name: 'Saint-Marin' },
  { emoji: '🇸🇹', name: 'Sao Tomé-et-Principe' },
  { emoji: '🇸🇳', name: 'Sénégal' },
  { emoji: '🇷🇸', name: 'Serbie' },
  { emoji: '🇸🇨', name: 'Seychelles' },
  { emoji: '🇸🇱', name: 'Sierra Leone' },
  { emoji: '🇸🇬', name: 'Singapour' },
  { emoji: '🇸🇰', name: 'Slovaquie' },
  { emoji: '🇸🇮', name: 'Slovénie' },
  { emoji: '🇸🇴', name: 'Somalie' },
  { emoji: '🇸🇩', name: 'Soudan' },
  { emoji: '🇸🇸', name: 'Soudan du Sud' },
  { emoji: '🇱🇰', name: 'Sri Lanka' },
  { emoji: '🇸🇪', name: 'Suède' },
  { emoji: '🇨🇭', name: 'Suisse' },
  { emoji: '🇸🇷', name: 'Suriname' },
  { emoji: '🇸🇾', name: 'Syrie' },
  { emoji: '🇹🇯', name: 'Tadjikistan' },
  { emoji: '🇹🇿', name: 'Tanzanie' },
  { emoji: '🇹🇩', name: 'Tchad' },
  { emoji: '🇹🇭', name: 'Thaïlande' },
  { emoji: '🇹🇱', name: 'Timor oriental' },
  { emoji: '🇹🇬', name: 'Togo' },
  { emoji: '🇹🇴', name: 'Tonga' },
  { emoji: '🇹🇹', name: 'Trinité-et-Tobago' },
  { emoji: '🇹🇳', name: 'Tunisie' },
  { emoji: '🇹🇲', name: 'Turkménistan' },
  { emoji: '🇹🇷', name: 'Turquie' },
  { emoji: '🇹🇻', name: 'Tuvalu' },
  { emoji: '🇺🇦', name: 'Ukraine' },
  { emoji: '🇺🇾', name: 'Uruguay' },
  { emoji: '🇻🇺', name: 'Vanuatu' },
  { emoji: '🇻🇦', name: 'Vatican' },
  { emoji: '🇻🇪', name: 'Venezuela' },
  { emoji: '🇻🇳', name: 'Vietnam' },
  { emoji: '🇾🇪', name: 'Yémen' },
  { emoji: '🇿🇲', name: 'Zambie' },
  { emoji: '🇿🇼', name: 'Zimbabwe' },
];

export default function CountryEmojiPicker({ onSelect }: CountryEmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredFlags = searchTerm
    ? COMMON_FLAGS.filter(flag => 
        flag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMMON_FLAGS

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition"
        title="Ajouter un drapeau"
      >
        <Globe size={18} />
        <span className="text-sm">Drapeau</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 bg-white border-2 border-gray-300 rounded-lg shadow-xl w-80">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un pays..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
          </div>
          
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {filteredFlags.map((flag) => (
                <button
                  key={flag.emoji}
                  type="button"
                  onClick={() => handleSelect(flag.emoji)}
                  className="text-3xl hover:bg-gray-100 rounded p-2 transition"
                  title={flag.name}
                >
                  {flag.emoji}
                </button>
              ))}
            </div>
            
            {filteredFlags.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">
                Aucun pays trouvé
              </p>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center">
            Cliquez sur un drapeau pour l'ajouter
          </div>
        </div>
      )}
    </div>
  )
}
