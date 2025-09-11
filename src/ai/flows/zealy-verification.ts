
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Schemas for Input and Output ---
const ConfirmZealyTasksInputSchema = z.object({
  uid: z.string().describe("The user's Supabase UID."),
  zealyId: z.string().describe("The user's Zealy ID."),
  xp: z.number().describe("The user's XP from Zealy."),
});
export type ConfirmZealyTasksInput = z.infer<typeof ConfirmZealyTasksInputSchema>;

const ConfirmZealyTasksOutputSchema = z.object({
  success: z.boolean().describe('Whether the user status was successfully updated.'),
  message: z.string().describe('A confirmation or denial message for the user.'),
});
export type ConfirmZealyTasksOutput = z.infer<typeof ConfirmZealyTasksOutputSchema>;


// --- Flow Definition ---
const confirmZealyTasksFlow = ai.defineFlow(
  {
    name: 'confirmZealyTasksFlow',
    inputSchema: ConfirmZealyTasksInputSchema,
    outputSchema: ConfirmZealyTasksOutputSchema,
  },
  async (input) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          hasCompletedZealyTasks: true,
          zealyId: input.zealyId,
          zealyXP: input.xp,
          waitlistJoinedAt: new Date().toISOString(),
         })
        .eq('uid', input.uid);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'User waitlist status confirmed successfully.'
      };

    } catch (error: any) {
      console.error("An unexpected error occurred during user update:", error);
      return { 
        success: false, 
        message: error.message || "An unexpected error occurred while updating your status." 
      };
    }
  }
);

// --- Exported Wrapper Function ---
export async function confirmZealyTasks(input: ConfirmZealyTasksInput): Promise<ConfirmZealyTasksOutput> {
  return confirmZealyTasksFlow(input);
}
