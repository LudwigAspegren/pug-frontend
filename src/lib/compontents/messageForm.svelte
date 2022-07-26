<script lang="ts">
	import { supabaseClientV2 } from '$lib/supabaseClientV2';

	import { page } from '$app/stores';
	import { queries } from '$lib/data/queries';
	import { TicketMessageValidator, type TicketMessage } from '$lib/data/validation';
	import { displayalert } from '$lib/stores/notificationStore';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validateSchema } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import { z } from 'zod';

	export let ticketId: number;
	let loading = false;
	let content: string;
	export let ticketMessage: TicketMessage;

	const createMessgeValidator = z.object({
		content: z.string().min(1, "Comment can't be empty")
	});

	const { form, reset, createSubmitHandler } = createForm<z.infer<typeof createMessgeValidator>>({
		validate: validateSchema(createMessgeValidator),
		extend: reporter(),

		onSubmit: async (values) => {
			inputField.blur();
			loading = true;
			if (!supabaseClientV2) throw 'supabase clinet not instantiated';
			const { data, error } = await supabaseClientV2
				.from('ticket_messages')
				.insert([
					{
						ticket_id: ticketId,
						content: values.content,
						date_created: new Date().toISOString(),
						user_id: $page.data.user.id
					}
				])
				.select(queries.fullTicketMessageQuery)
				.single();
			if (error) throw error.message;
			ticketMessage = TicketMessageValidator.parse(data);
			return ticketMessage;
		},
		onSuccess: () => {
			loading = false;
			reset();
		},
		onError: (e) => {
			inputField.focus();
			displayalert('Error:', e as string, 'SUCCESS');
		}
	});
	const disableEnter = (event: KeyboardEvent) => {
		if (event.code === 'Enter' && loading) event.preventDefault();
	};
	let inputField: HTMLInputElement;
</script>

<form use:form class="flex flex-col gap-2 pb-16">
	<input
		type="text"
		placeholder="Type here"
		class="textarea w-full"
		name="content"
		aria-describedby="content-validation"
		bind:value={content}
		on:keypress={disableEnter}
		bind:this={inputField}
	/>
	<div class="flex justify-between">
		<input class="btn" type="submit" disabled={loading} value="Comment" />
		<ValidationMessage for="content" let:messages>
			{messages?.[0] || ''}
		</ValidationMessage>
	</div>
</form>
