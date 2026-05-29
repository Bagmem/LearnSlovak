"use client"

import { FaCamera, FaEnvelope, FaPen, FaUserCircle, FaCopy } from "react-icons/fa"

type UserProfileCardProps = {
  photoURL: string
  displayName: string
  editingName: boolean
  newName: string
  setNewName: (name: string) => void
  onSaveName: () => void
  onStartEdit: () => void
  displayEmail: string
  userId: string
  onCopyId: (text: string) => void
  uploadingAvatar: boolean
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function UserProfileCard({
  photoURL,
  displayName,
  editingName,
  newName,
  setNewName,
  onSaveName,
  onStartEdit,
  displayEmail,
  userId,
  onCopyId,
  uploadingAvatar,
  onAvatarUpload,
}: UserProfileCardProps) {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-2">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            {photoURL ? (
              <img src={photoURL} alt="Аватар" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-orange-500 p-0.5 text-white shadow-md transition hover:bg-orange-600">
            <FaCamera className="text-[10px]" />
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} disabled={uploadingAvatar} />
          </label>
        </div>
        {editingName ? (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Новое имя"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button onClick={onSaveName} className="rounded-lg bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white hover:bg-orange-600 transition">
              Сохранить
            </button>
          </div>
        ) : (
          <h2 className="text-base font-black text-gray-800 dark:text-white">{displayName}</h2>
        )}
        <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <FaEnvelope className="text-[10px]" /> {displayEmail}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <span>🆔</span>
          <span className="font-mono">{userId.slice(0, 8)}...</span>
          <button onClick={() => onCopyId(userId)} className="text-gray-400 hover:text-orange-500 transition">
            <FaCopy size={8} />
          </button>
        </p>
        <button
          onClick={onStartEdit}
          className="mt-1 inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <FaPen size={8} /> Редактировать
        </button>
      </div>
    </div>
  )
}