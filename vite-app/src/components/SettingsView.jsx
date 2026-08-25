import { useState } from 'react';

export const SettingsView = ({ db, onAddQuestions }) => {
    const [importMsg, setImportMsg] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) throw new Error();

                let validQuestions = [];
                let skippedCount = 0;

                importedData.forEach(q => {
                    const qText = q.question || q.text;
                    if (qText && q.optionA && q.optionB && q.optionC && q.optionD && q.correctAnswer && q.explanation) {
                        const isDuplicate = db.some(existing => (existing.text || existing.question || "").trim() === qText.trim());
                        if (!isDuplicate) {
                            validQuestions.push({
                                id: q.id || `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                type: q.type || 'PYQ',
                                subject: q.subject || 'CS',
                                unit: q.unit || 'Miscellaneous',
                                topic: q.topic || 'Imported Question',
                                difficulty: q.difficulty ? q.difficulty.toUpperCase() : 'MODERATE',
                                text: qText,
                                optionA: q.optionA,
                                optionB: q.optionB,
                                optionC: q.optionC,
                                optionD: q.optionD,
                                correctAnswer: q.correctAnswer.toUpperCase(),
                                explanation: q.explanation,
                                examYear: q.year || q.examYear || null,
                                shift: q.shift || null,
                                source: q.source || null
                            });
                        } else {
                            skippedCount++;
                        }
                    } else {
                        skippedCount++;
                    }
                });

                onAddQuestions(validQuestions);
                setImportMsg(`Success! Added ${validQuestions.length} questions. Skipped ${skippedCount} duplicates/invalid.`);
            } catch (err) {
                setImportMsg("Error parsing JSON file. Please ensure it is a valid JSON array.");
            }
            event.target.value = "";
        };
        reader.readAsText(file);
    };

    const downloadBackup = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "stet_db_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="p-8 max-w-3xl mx-auto w-full animate-in fade-in">
            <div className="flex items-center mb-6">
                <i className="fas fa-cog text-3xl text-slate-600 mr-3"></i>
                <h2 className="text-3xl font-black text-slate-800">Settings & Data</h2>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Manage Question Bank</h3>
                <p className="text-slate-500 mb-4 text-sm">Upload a JSON file to add questions to your local storage, or export your full question bank.</p>

                <div className="flex gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
                        <i className="fas fa-cloud-upload-alt text-indigo-500 text-2xl mb-2"></i>
                        <span className="font-bold text-indigo-700 text-sm">Import JSON Mini-Batch</span>
                        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button onClick={downloadBackup} className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors">
                        <i className="fas fa-file-download text-emerald-500 text-2xl mb-2"></i>
                        <span className="font-bold text-emerald-700 text-sm">Export JSON Backup</span>
                    </button>
                </div>

                {importMsg && (
                    <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${importMsg.includes('Success') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                        {importMsg}
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-200 border-l-4 border-l-rose-500">
                <h3 className="text-xl font-bold text-rose-800 mb-2">Danger Zone</h3>
                <p className="text-slate-600 mb-6">Clearing your local storage will delete all your attempts and custom questions permanently.</p>
                <button onClick={() => { if (window.confirm("Delete all data?")) { window.localStorage.clear(); window.location.reload(); } }} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center">
                    <i className="fas fa-trash-alt w-5 mr-2"></i> Factory Reset App
                </button>
            </div>
        </div>
    );
};
