import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/layout/Header';
import ProfilePanel from './components/profile/ProfilePanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ExtractorPage from './pages/ExtractorPage';
import CollectionsPage from './pages/CollectionsPage';
import MixerPage from './pages/MixerPage';

import { useLocalStorage } from './hooks/useLocalStorage';
import { usePaletteStats } from './hooks/usePaletteStats';

import { exportToJSON, prepareExportData } from './utils/exportUtils';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('extractor');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [colorCount, setColorCount] = useLocalStorage('chromp-color-count', 5);

  const [darkMode, setDarkMode] = useLocalStorage('chromp-theme', false);
  const [savedPalettes, setSavedPalettes] = useLocalStorage('chromp-palettes', []);
  const [cardSize, setCardSize] = useLocalStorage('chromp-card-size', 'medium');

  const [currentUser, setCurrentUser] = useLocalStorage('chromp-user', {
    id: 'user1',
    name: 'Usuario Chromp',
    avatar: '🎨',
    bio: 'Amante de los colores',
    palettesCount: 0
  });

  const stats = usePaletteStats(savedPalettes);

  useEffect(() => {
    if (savedPalettes.length !== currentUser.palettesCount) {
      setCurrentUser({
        ...currentUser,
        palettesCount: savedPalettes.length
      });
    }
  }, [savedPalettes.length, currentUser, setCurrentUser]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleCopyColor = (hex, name) => {
    navigator.clipboard.writeText(hex);
    toast.success(`✅ ${name || hex} copiado`);
  };

  const handleExportData = () => {
    const data = prepareExportData(
      savedPalettes,
      currentUser,
      {
        totalPalettes: savedPalettes.length,
        uniqueColors: stats.uniqueColorsCount,
        favoriteColors: stats.favoriteColors,
        distribution: stats.detailedStats
      }
    );
    exportToJSON(data, 'chromp-backup');
    toast.success('📥 Datos exportados correctamente');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={darkMode ? 'dark' : 'light'}
      />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onProfileClick={() => setShowProfile(true)}
        onSettingsClick={() => setShowSettings(true)}
        savedPalettesCount={savedPalettes.length}
      />

      {/* Paneles */}
      <ProfilePanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={currentUser}
        onUpdateUser={setCurrentUser}
        savedPalettes={savedPalettes}
        stats={stats}
        onCopyColor={handleCopyColor}
        onExport={handleExportData}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        colorCount={colorCount}
        onColorCountChange={setColorCount} 
        cardSize={cardSize}
        onCardSizeChange={setCardSize}
      />

      {/* Páginas */}
      <main className="main">
        {activeTab === 'extractor' && (
          <ExtractorPage
            savedPalettes={savedPalettes}
            setSavedPalettes={setSavedPalettes}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            cardSize={cardSize}
            colorCount={colorCount}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsPage
            savedPalettes={savedPalettes}
            setSavedPalettes={setSavedPalettes}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            cardSize={cardSize}
            onCopyColor={handleCopyColor}
          />
        )}

        {activeTab === 'mixer' && (
          <MixerPage
            savedPalettes={savedPalettes}
            setSavedPalettes={setSavedPalettes}  
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            cardSize={cardSize}
            onCopyColor={handleCopyColor}
          />
        )}
      </main>
    </div>
  );
}

export default App;