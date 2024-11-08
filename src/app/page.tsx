'use client'

import React, { useState } from 'react';

// import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Tag, X, BookOpen, Clock, CalendarDays, Bot } from 'lucide-react'
// import Image from 'next/image'

export default function AIEnhancedLessonPlanManager() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/chat',
  })

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log({ title, description, date, tags })
      setIsSubmitting(false)
      // Reset form after submission
      setTitle('')
      setDescription('')
      setDate(undefined)
      setTags([])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">AI-Enhanced Lesson Plan Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div layout className="space-y-2">
                <Label htmlFor="title" className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Title</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </motion.div>

              <motion.div layout className="space-y-2">
                <Label htmlFor="description" className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Description</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter lesson description"
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </motion.div>

              <motion.div layout className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>Date</span>
                </Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </motion.div>

              <motion.div layout className="space-y-2">
                <Label htmlFor="tags" className="flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>
                <motion.div layout className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {tags.map(tag => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)} 
                          className="ml-1 focus:outline-none"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Lesson Plan'}
                </Button>
                {isSubmitting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                  </motion.div>
                )}
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Assistant
              </h3>
              <div className="h-64 overflow-y-auto mb-4 border rounded p-2">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex items-center">
                <Input
                  value={input}
                  placeholder="Ask for lesson plan ideas..."
                  onChange={handleInputChange}
                  className="flex-grow mr-2"
                />
                <Button type="submit">Send</Button>
              </form>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}