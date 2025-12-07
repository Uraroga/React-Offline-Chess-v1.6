import React, { useState } from 'react';
import { X, WifiOff, MessageCircle, Save, Download, Move, FileText } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [lang, setLang] = useState<'it' | 'en'>('it');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center animate-fadeIn p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              {lang === 'it' ? 'Guida & Funzionamento' : 'Guide & How it Works'}
            </h2>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setLang('it')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'it' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                IT
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-600 leading-relaxed">
          
          {/* 1. General Info */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
              <WifiOff className="text-blue-600" size={20} />
              {lang === 'it' ? '1. Funzionamento Generale Offline' : '1. General Offline Functionality'}
            </h3>
            <p>
              {lang === 'it' 
                ? 'Questa applicazione permette di giocare a scacchi completamente offline. Non c’è nessun server, nessun database e nessuna connessione a internet richiesta. Tutta la logica di gioco è gestita localmente dal tuo browser.'
                : 'This application allows you to play chess completely offline. No server, no database, and no internet connection required. All game logic is handled locally by your browser.'}
            </p>
          </section>

          {/* 2. Movements */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
              <Move className="text-blue-600" size={20} />
              {lang === 'it' ? '2. Movimenti della Scacchiera' : '2. Board Movements'}
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                {lang === 'it' 
                  ? 'È possibile muovere i pezzi trascinandoli (Drag & Drop) o cliccando sulla casa di partenza e poi su quella di arrivo.'
                  : 'You can move pieces by dragging them (Drag & Drop) or by clicking the source square and then the destination square.'}
              </li>
              <li>
                {lang === 'it'
                  ? 'Tutte le regole ufficiali (arrocco, en passant, scacco) sono validate automaticamente.'
                  : 'All official rules (castling, en passant, check) are automatically validated.'}
              </li>
              <li>
                {lang === 'it'
                  ? 'La posizione si aggiorna istantaneamente dopo ogni mossa valida.'
                  : 'The position updates instantly after every valid move.'}
              </li>
            </ul>
          </section>

          {/* 3. FEN String */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
              <FileText className="text-blue-600" size={20} />
              {lang === 'it' ? '3. Stringa FEN' : '3. FEN String'}
            </h3>
            <p>
              {lang === 'it'
                ? "Dopo ogni mossa, l'app genera una stringa FEN (Forsyth-Edwards Notation), un codice che rappresenta l'esatta posizione dei pezzi sulla scacchiera in quel momento. Puoi copiarla facilmente usando il pulsante \"Copy\" nel pannello laterale."
                : "After every move, the app generates a FEN (Forsyth-Edwards Notation) string, a code representing the exact position of pieces on the board. You can easily copy it using the \"Copy\" button in the side panel."}
            </p>
          </section>

          {/* 4. Play via Chat (Highlighted) */}
          <section className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-800 mb-3">
              <MessageCircle className="text-blue-600" size={20} />
              {lang === 'it' ? '4. Come giocare a distanza (Via Chat)' : '4. How to Play Remote (Via Chat)'}
            </h3>
            <p className="mb-3">
              {lang === 'it'
                ? 'Due giocatori distanti possono giocare la stessa partita senza essere connessi a un server, semplicemente usando una chat (WhatsApp, Telegram, SMS, Email).'
                : 'Two distant players can play the same game without being connected to a server, simply using a chat (WhatsApp, Telegram, SMS, Email).'}
            </p>
            <ol className="list-decimal list-inside space-y-2 font-medium text-slate-700">
              <li>
                {lang === 'it' 
                  ? 'Il Giocatore A fa la sua mossa sulla scacchiera.' 
                  : 'Player A makes a move on the board.'}
              </li>
              <li>
                {lang === 'it' 
                  ? 'Il Giocatore A copia la stringa FEN e la invia al Giocatore B tramite chat.' 
                  : 'Player A copies the FEN string and sends it to Player B via chat.'}
              </li>
              <li>
                {lang === 'it' 
                  ? 'Il Giocatore B riceve il messaggio, copia il codice FEN e lo incolla nella sezione "Import FEN" dell\'app.' 
                  : 'Player B receives the message, copies the FEN code, and pastes it into the "Import FEN" section.'}
              </li>
              <li>
                {lang === 'it' 
                  ? 'Il Giocatore B preme "Applica FEN": la sua scacchiera si aggiorna alla posizione dell\'avversario.' 
                  : 'Player B presses "Applica FEN": their board updates to the opponent\'s position.'}
              </li>
              <li>
                {lang === 'it' 
                  ? 'Il Giocatore B fa la sua mossa e ripete il processo inviando il nuovo FEN al Giocatore A.' 
                  : 'Player B makes their move and repeats the process sending the new FEN to Player A.'}
              </li>
            </ol>
          </section>

          {/* 5. External Import */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
              <Download className="text-blue-600" size={20} />
              {lang === 'it' ? '5. Importazione da Siti Esterni' : '5. Import from External Sites'}
            </h3>
            <p>
              {lang === 'it'
                ? "L'app è compatibile con tutti i principali siti di scacchi (Lichess, Chess.com, Scid). Puoi copiare un FEN da un'analisi o un puzzle esterno e incollarlo qui per visualizzarlo o giocarci contro."
                : "The app is compatible with all major chess websites (Lichess, Chess.com, Scid). You can copy a FEN from an external analysis or puzzle and paste it here to view or play against it."}
            </p>
          </section>

          {/* 6. No Save */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
              <Save className="text-red-500" size={20} />
              {lang === 'it' ? '6. Nessun Salvataggio Automatico' : '6. No Auto-Save'}
            </h3>
            <p>
              {lang === 'it'
                ? "Attenzione: L’app non salva nulla su file o database. Se chiudi o ricarichi la pagina, la partita corrente viene persa. Per salvare una partita, copia la FEN o la cronologia delle mosse (PGN/UCI) e salvala in un file di testo sul tuo computer."
                : "Warning: The app does not save anything to files or databases. If you close or refresh the page, the current game is lost. To save a game, copy the FEN or move history (SAN/UCI) and save it to a text file on your computer."}
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            {lang === 'it' ? 'Chiudi' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};