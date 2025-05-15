
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="flex items-center">
          <Globe size={18} />
          <span className="ml-1 md:inline hidden">{language === 'en' ? 'EN' : 'VI'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <span className={`${language === 'en' ? 'font-bold' : ''}`}>{t('language.en')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('vi')}>
          <span className={`${language === 'vi' ? 'font-bold' : ''}`}>{t('language.vi')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
